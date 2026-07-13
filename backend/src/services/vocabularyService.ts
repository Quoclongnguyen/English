import mongoose from 'mongoose';
import { User } from '../models/User';
import { PhotoScan } from '../models/PhotoScan';
import { Word } from '../models/Word';
import { UserWordProgress } from '../models/UserWordProgress';
import { XP_ECONOMY, RATE_CAPS } from '../config/xpConfig';
import { BadgeService } from './badgeService';
import { classifyVocabularyTopics } from './geminiService';
import { normalizeVocabularyTopic, VocabularyTopic } from '../constants/vocabularyTopics';

const badgeService = new BadgeService();

export class VocabularyService {
  /**
   * Save selected words from a photo scan
   * Handles deduplication automatically across Word, UserWordProgress and User.vocabulary
   */
  async saveWordsFromPhotoScan(
    userId: string,
    photoScanId: string,
    selectedWords: Array<{
      word: string;
      phonetic: string;
      meaning_vi: string;
      example: string;
    }>
  ) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const photoScan = await PhotoScan.findById(photoScanId);
    if (!photoScan || photoScan.userId.toString() !== userId) {
      throw new Error('PhotoScan not found or unauthorized');
    }

    const savedWordStrings: string[] = [];
    const newWords: string[] = [];
    const duplicates: string[] = [];
    const topicClassifications = await classifyVocabularyTopics(
      selectedWords.map(word => ({
        word: word.word,
        meaning_vi: word.meaning_vi,
        example: word.example,
      }))
    );
    const topicMap = new Map(
      topicClassifications.map(item => [
        item.word.trim().toLowerCase(),
        item.topic,
      ])
    );

    // Helper to calculate daily scan XP cap
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStatsIndex = user.studyHistory.findIndex(h => {
      const hDate = new Date(h.date);
      hDate.setHours(0, 0, 0, 0);
      return hDate.getTime() === today.getTime();
    });

    let todayPhotoXP = 0;
    if (todayStatsIndex !== -1) {
      todayPhotoXP = user.studyHistory[todayStatsIndex].xpEarned;
    }

    // Process each selected word
    for (const wordData of selectedWords) {
      const wordLower = wordData.word.toLowerCase().trim();
      const topic: VocabularyTopic = normalizeVocabularyTopic(
        (wordData as any).topic || topicMap.get(wordLower)
      );
      savedWordStrings.push(wordLower);

      // 1. Ensure Word exists in global collection
      let wordDoc = await Word.findOne({ word: wordLower });
      if (!wordDoc) {
        wordDoc = await Word.create({
          word: wordLower,
          phonetic: wordData.phonetic,
          type: 'noun', // Default type if not sent, or can be parsed
          meaning_vi: wordData.meaning_vi,
          example: wordData.example,
          source: 'camera',
          photoRef: photoScan.photoUrl,
          topic,
          topicSource: topic === 'other' ? 'fallback' : 'gemini',
          level: user.level
        });
      } else if (normalizeVocabularyTopic(wordDoc.topic) === 'other' && topic !== 'other') {
        wordDoc.topic = topic;
        wordDoc.topicSource = 'gemini';
        await wordDoc.save();
      }

      // 2. Check if already in user's unified vocabulary array
      const existingInVocab = user.vocabulary.find(
        v => v.word.toLowerCase() === wordLower
      );

      if (existingInVocab) {
        duplicates.push(wordLower);
        existingInVocab.reviewCount += 1;
      } else {
        // Add to user.vocabulary
        user.vocabulary.push({
          word: wordLower,
          source: 'photo',
          photoScanId: photoScan._id as mongoose.Types.ObjectId,
          learnedAt: new Date(),
          mastered: false,
          reviewCount: 0
        });
        newWords.push(wordLower);

        // 3. Ensure UserWordProgress exists for SM-2 reviews
        const existingProgress = await UserWordProgress.findOne({
          userId,
          wordId: wordDoc._id
        });

        if (!existingProgress) {
          await UserWordProgress.create({
            userId,
            wordId: wordDoc._id,
            status: 'learning'
          });
        }
      }
    }

    // Update PhotoScan saved words
    photoScan.savedWords = savedWordStrings;

    // Calculate XP: 10 XP per new word, subject to daily cap
    const rawXp = newWords.length * XP_ECONOMY.EARN.photoScanNewWord;
    const remainingCap = Math.max(0, RATE_CAPS.maxDailyPhotoXP - todayPhotoXP);
    const xpEarned = Math.min(rawXp, remainingCap);

    user.totalXP += xpEarned;
    photoScan.xpEarned = xpEarned;

    // Update Study History
    if (todayStatsIndex === -1) {
      user.studyHistory.push({
        date: today,
        xpEarned,
        wordsLearned: newWords.length,
        photosScanned: 1
      });
    } else {
      user.studyHistory[todayStatsIndex].xpEarned += xpEarned;
      user.studyHistory[todayStatsIndex].wordsLearned += newWords.length;
      user.studyHistory[todayStatsIndex].photosScanned += 1;
    }

    await user.save();
    await photoScan.save();

    // Check badges
    const newlyUnlockedBadges = await badgeService.checkAndUnlockBadges(userId);

    return {
      success: true,
      newWordsCount: newWords.length,
      duplicatesCount: duplicates.length,
      newWords,
      duplicates,
      xpEarned,
      newlyUnlockedBadges,
      message: `Lưu ${newWords.length} từ mới. ${
        duplicates.length > 0 ? `${duplicates.length} từ đã học trước đó.` : ''
      }`,
      totalVocab: user.vocabulary.length
    };
  }

  /**
   * Get user's vocabulary list (unified)
   */
  async getUserVocabulary(
    userId: string,
    filters?: {
      source?: 'photo' | 'review';
      mastered?: boolean;
      search?: string;
    }
  ) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    let list = user.vocabulary.map(v => v.toObject());

    // Populate details (phonetic, type, meaning_vi, example) from Word collection
    // Fetch all words corresponding to user vocabulary
    const wordNames = list.map(v => v.word);
    const wordsDetails = await Word.find({ word: { $in: wordNames } });
    const detailsMap = new Map(wordsDetails.map(w => [w.word.toLowerCase(), w]));

    let populatedList = list.map(v => {
      const details = detailsMap.get(v.word.toLowerCase());
      return {
        ...v,
        phonetic: details?.phonetic || '',
        type: details?.type || '',
        meaning_vi: details?.meaning_vi || '',
        example: details?.example || '',
        photoRef: details?.photoRef || ''
      };
    });

    // Apply filters
    if (filters?.source) {
      populatedList = populatedList.filter(w => w.source === filters.source);
    }

    if (filters?.mastered !== undefined) {
      populatedList = populatedList.filter(w => w.mastered === filters.mastered);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      populatedList = populatedList.filter(
        w =>
          w.word.toLowerCase().includes(searchLower) ||
          w.meaning_vi.toLowerCase().includes(searchLower)
      );
    }

    return populatedList;
  }

  /**
   * Mark a word as mastered
   */
  async markWordAsMastered(userId: string, word: string) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const vocabItem = user.vocabulary.find(
      v => v.word.toLowerCase() === word.toLowerCase()
    );

    if (vocabItem && !vocabItem.mastered) {
      vocabItem.mastered = true;
      user.totalXP += XP_ECONOMY.EARN.markMastered;
      await user.save();
      
      // Also update in UserWordProgress
      const wordDoc = await Word.findOne({ word: word.toLowerCase() });
      if (wordDoc) {
        await UserWordProgress.updateOne(
          { userId, wordId: wordDoc._id },
          { $set: { status: 'mastered' } }
        );
      }
      return true;
    }
    return false;
  }

  /**
   * Fetch user's scanned photos grouped with words
   */
  async getPhotoDeck(
    userId: string,
    options?: {
      sort?: 'recent' | 'oldest' | 'alphabetical';
      search?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const filter: any = {
      userId,
      'savedWords.0': { $exists: true }
    };

    // Search in story or words
    if (options?.search) {
      filter.$or = [
        { story: { $regex: options.search, $options: 'i' } },
        { savedWords: { $regex: options.search.toLowerCase(), $options: 'i' } }
      ];
    }

    let query = PhotoScan.find(filter);
    // Sort options
    switch (options?.sort) {
      case 'oldest':
        query = query.sort({ createdAt: 1 });
        break;
      case 'alphabetical':
        query = query.sort({ story: 1 });
        break;
      case 'recent':
      default:
        query = query.sort({ createdAt: -1 });
        break;
    }

    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const skip = (page - 1) * limit;

    const scans = await query.skip(skip).limit(limit).lean();
    const total = await PhotoScan.countDocuments(filter);

    // For each scan, we can fetch full details of its saved words if needed
    // However, photo detail modal needs word translations.
    // Let's populate the details of saved words for each scan.
    const populatedScans = await Promise.all(
      scans.map(async scan => {
        const words = await Word.find({ word: { $in: scan.savedWords } });
        return {
          ...scan,
          words: words.map(w => ({
            word: w.word,
            phonetic: w.phonetic,
            type: w.type,
            meaning_vi: w.meaning_vi,
            example: w.example,
            topic: w.topic,
            topicSource: w.topicSource
          }))
        };
      })
    );

    return {
      data: populatedScans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}
