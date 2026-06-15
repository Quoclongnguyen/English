import { Request, Response } from 'express';
import { Word } from '../models/Word';
import { UserWordProgress } from '../models/UserWordProgress';
import { User } from '../models/User';
import { generateDailyVocab } from '../services/geminiService';
import { calculateSM2, getNextReviewDate, SM2Quality } from '../services/sm2Service';

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

    // Streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastStudy = user.lastStudyDate;

    if (lastStudy && lastStudy >= yesterday && lastStudy < today) {
      user.streak += 1; // Học liên tiếp
    } else if (!lastStudy || lastStudy < yesterday) {
      user.streak = 1; // Reset nếu bỏ ngày
    }

    user.lastStudyDate = new Date(); // cập nhật ngày học
    await user.save();

    res.json({
      words: allWords,
      story: result.story,
      streak: user.streak
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

    // Reward XP
    if (quality >= 3) {
      const user = await User.findById(userId);
      if (user) {
        user.xp += 10;
        await user.save();
      }
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
