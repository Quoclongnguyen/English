import { Request, Response } from 'express';
import { Word } from '../models/Word';
import { UserWordProgress } from '../models/UserWordProgress';
import { User } from '../models/User';
import { generateDailyVocab, GeminiService } from '../services/geminiService';
import { calculateSM2, getNextReviewDate, SM2Quality } from '../services/sm2Service';
import { XP_ECONOMY } from '../config/xpConfig';
import { BadgeService } from '../services/badgeService';
import { UploadService } from '../services/uploadService';
import { VocabularyService } from '../services/vocabularyService';

const badgeService = new BadgeService();
const uploadService = new UploadService();
const geminiService = new GeminiService();
const vocabularyService = new VocabularyService();

// Extend Express Request to include user (added by auth middleware)
interface AuthRequest extends Request {
  user?: any;
}

export const getDailyWords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if user already learned today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find words learned today
    const progressToday = await UserWordProgress.find({
      userId,
      status: 'learning',
      createdAt: { $gte: today }
    }).populate('wordId');

    if (progressToday.length >= user.dailyTarget) {
      const words = progressToday.map(p => p.wordId);
      res.json({ message: 'Already completed daily goal', words });
      return;
    }

    // Need to generate new words
    // Get list of already learned words to avoid repetition
    const allProgress = await UserWordProgress.find({ userId }).populate('wordId');
    const learnedWords = allProgress.map(p => (p.wordId as any).word);

    const neededCount = user.dailyTarget - progressToday.length;

    const result = await generateDailyVocab({
      level: user.level,
      goal: user.goal,
      count: neededCount,
      learnedWords
    });
    //  1 query lấy tất cả
    const wordNames = result.words.map(gw => gw.word);
    const existingWords = await Word.find({ word: { $in: wordNames } });
    const existingWordMap = new Map(existingWords.map(w => [w.word, w]));

    const newWordsData = result.words
      .filter(gw => !existingWordMap.has(gw.word))
      .map(gw => ({
        ...gw,
        topic: user.goal,
        level: user.level,
        source: 'daily',
        story: result.story
      }));
    //  Insert words mới 1 lần
    const insertedWords = newWordsData.length > 0
      ? await Word.insertMany(newWordsData, { ordered: false })
      : [];

    //3: Insert tất cả progress 1 lần
    const allWords = [...existingWords, ...insertedWords];
    const progressData = allWords.map(word => ({
      userId,
      wordId: word._id,
      status: 'learning'
    }));

    await UserWordProgress.insertMany(progressData, { ordered: false })
      .catch(err => {
        if (err.code !== 11000) throw err;
      });

    // Sync newly learned words to User.vocabulary array
    for (const word of allWords) {
      const wordLower = word.word.toLowerCase().trim();
      const exists = user.vocabulary.some(v => v.word.toLowerCase() === wordLower);
      if (!exists) {
        user.vocabulary.push({
          word: wordLower,
          source: 'review',
          learnedAt: new Date(),
          mastered: false,
          reviewCount: 0
        } as any);
      }
    }

    // Streak logic
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastStudy = user.currentStreak.lastStudyDate;
    let isFirstStudyToday = false;

    if (!lastStudy || lastStudy < today) {
      isFirstStudyToday = true;
    }

    if (lastStudy && lastStudy >= yesterday && lastStudy < today) {
      user.currentStreak.count += 1;
    } else if (!lastStudy || lastStudy < yesterday) {
      user.currentStreak.count = 1;
    }

    user.currentStreak.lastStudyDate = new Date();

    // Gamification: XP reward for daily study session
    let xpEarned = 0;
    if (isFirstStudyToday) {
      xpEarned += XP_ECONOMY.EARN.dailyStreakBonus; // +20 XP
      user.totalXP += XP_ECONOMY.EARN.dailyStreakBonus;
    }

    // Update studyHistory
    const statsIndex = user.studyHistory.findIndex(h => {
      const hDate = new Date(h.date);
      hDate.setHours(0, 0, 0, 0);
      return hDate.getTime() === today.getTime();
    });

    if (statsIndex === -1) {
      user.studyHistory.push({
        date: today,
        xpEarned,
        wordsLearned: neededCount,
        photosScanned: 0
      });
    } else {
      user.studyHistory[statsIndex].xpEarned += xpEarned;
      user.studyHistory[statsIndex].wordsLearned += neededCount;
    }

    await user.save();

    // Check for badges
    const newlyUnlockedBadges = await badgeService.checkAndUnlockBadges(userId);

    res.json({
      words: allWords,
      story: result.story,
      streak: user.currentStreak.count,
      newlyUnlockedBadges
    });
  } catch (error: any) {
    console.error('Error generating daily words:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getVocabBank = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const { topic, level, status } = req.query;

    const query: any = { userId };
    if (status) query.status = status;

    const progresses = await UserWordProgress.find(query);
    const wordIds = progresses.map(p => p.wordId);

    const wordQuery: any = { _id: { $in: wordIds } };
    if (topic) wordQuery.topic = topic;
    if (level) wordQuery.level = level;

    const words = await Word.find(wordQuery);


    res.json(words);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getReviewQueue = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const now = new Date();

    const queue = await UserWordProgress.find({
      userId,
      nextReviewDate: { $lte: now },
      status: { $in: ['learning', 'reviewing'] }
    }).populate('wordId');

    res.json(queue);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const { wordId, quality } = req.body; // quality: 0-5

    if (!Number.isInteger(quality) || quality < 0 || quality > 5) {
      res.status(400).json({ message: 'Quality phải là số nguyên 0-5' });
      return;
    }

    const progress = await UserWordProgress.findOne({ userId, wordId });
    if (!progress) {
      res.status(404).json({ message: 'Progress not found' });
      return;
    }

    const sm2Result = calculateSM2(
      quality as SM2Quality,
      progress.reviewCount,
      progress.interval,
      progress.easeFactor
    );

    progress.interval = sm2Result.interval;
    progress.reviewCount = sm2Result.reviewCount;
    progress.easeFactor = sm2Result.easeFactor;
    progress.nextReviewDate = getNextReviewDate(sm2Result.interval);
    progress.lastResult = quality >= 3 ? 'correct' : 'wrong';


    if (sm2Result.interval > 21) progress.status = 'mastered';
    else if (sm2Result.interval > 1) progress.status = 'reviewing';
    else progress.status = 'learning';

    await progress.save();

    // Reward XP and update user vocabulary status
    const user = await User.findById(userId);
    if (user) {
      const wordDoc = await Word.findById(wordId);
      const wordName = wordDoc ? wordDoc.word.toLowerCase().trim() : '';

      const vocabItem = user.vocabulary.find(v => v.word.toLowerCase() === wordName);
      if (vocabItem) {
        vocabItem.reviewCount += 1;
        if (progress.status === 'mastered' && !vocabItem.mastered) {
          vocabItem.mastered = true;
          user.totalXP += XP_ECONOMY.EARN.markMastered; // +5 XP
        }
      }

      let xpGained = 0;
      if (quality >= 3) {
        xpGained += XP_ECONOMY.EARN.reviewWord; // +5 XP
        user.totalXP += XP_ECONOMY.EARN.reviewWord;
      }

      // Update studyHistory
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const statsIndex = user.studyHistory.findIndex(h => {
        const hDate = new Date(h.date);
        hDate.setHours(0, 0, 0, 0);
        return hDate.getTime() === today.getTime();
      });

      if (statsIndex === -1) {
        user.studyHistory.push({
          date: today,
          xpEarned: xpGained,
          wordsLearned: 0,
          photosScanned: 0
        });
      } else {
        user.studyHistory[statsIndex].xpEarned += xpGained;
      }

      await user.save();

      // Check badges
      await badgeService.checkAndUnlockBadges(userId);
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const scanCameraPhoto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const { base64Image, mimeType } = req.body;

    if (!base64Image) {
      res.status(400).json({ message: 'Missing base64Image' });
      return;
    }

    // Save image (local or Cloudinary)
    const photoUrl = await uploadService.saveImage(base64Image, mimeType);

    // Call Gemini Vision with rate limiting & SHA256 caching
    const base64Clean = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');
    
    const scanResult = await geminiService.scanPhotoWithLimits(userId, buffer, mimeType);

    // Create a temporary PhotoScan in DB
    const { PhotoScan } = require('../models/PhotoScan');
    const photoScan = await PhotoScan.create({
      userId,
      photoUrl,
      story: scanResult.story,
      detectedWords: scanResult.words,
      savedWords: []
    });

    res.json({
      photoScanId: photoScan._id,
      photoUrl,
      story: scanResult.story,
      words: scanResult.words,
      fromCache: scanResult.fromCache
    });
  } catch (error: any) {
    console.error('Error scanning camera photo:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const saveCameraWords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const { photoScanId, selectedWords } = req.body;

    if (!photoScanId || !selectedWords || !Array.isArray(selectedWords)) {
      res.status(400).json({ message: 'Missing photoScanId or selectedWords' });
      return;
    }

    const result = await vocabularyService.saveWordsFromPhotoScan(userId, photoScanId, selectedWords);
    res.json(result);
  } catch (error: any) {
    console.error('Error saving camera words:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getPhotoDeck = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const { sort, search, page, limit } = req.query;

    const result = await vocabularyService.getPhotoDeck(userId, {
      sort: sort as any,
      search: search as any,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error getting photo deck:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
