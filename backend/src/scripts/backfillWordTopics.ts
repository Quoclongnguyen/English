import 'dotenv/config';
import mongoose from 'mongoose';
import { Word } from '../models/Word';
import { classifyVocabularyTopics } from '../services/geminiService';
import { normalizeVocabularyTopic } from '../constants/vocabularyTopics';

const BATCH_SIZE = 25;

const backfill = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI is required');

  await mongoose.connect(mongoUri);

  const words = await Word.find({
    $or: [
      { topic: { $exists: false } },
      { topic: { $in: ['camera', 'daily', 'ielts', 'toeic'] } },
      { topic: 'other' },
    ],
  }).sort({ updatedAt: -1 });

  let updated = 0;
  let fallback = 0;

  for (let index = 0; index < words.length; index += BATCH_SIZE) {
    const batch = words.slice(index, index + BATCH_SIZE);
    const classifications = await classifyVocabularyTopics(
      batch.map(word => ({
        word: word.word,
        meaning_vi: word.meaning_vi,
        example: word.example,
      }))
    );
    const topicMap = new Map(
      classifications.map(item => [item.word.trim().toLowerCase(), item.topic])
    );

    for (const word of batch) {
      const topic = normalizeVocabularyTopic(topicMap.get(word.word.trim().toLowerCase()));
      word.topic = topic;
      word.topicSource = topic === 'other' ? 'fallback' : 'gemini';
      await word.save();
      updated += 1;
      if (topic === 'other') fallback += 1;
    }

    console.log(`Backfilled ${Math.min(index + BATCH_SIZE, words.length)}/${words.length}`);
  }

  console.log(`Backfilled ${updated} words. Fallback topic: ${fallback}`);
};

backfill()
  .catch(error => {
    console.error('Unable to backfill word topics:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
