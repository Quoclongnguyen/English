import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { GrammarExercise } from '../models/GrammarExercise';
import { GrammarTopic } from '../models/GrammarTopic';

const seed = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI is required');

  const seedPath = path.join(__dirname, '../seeds/grammar.sample.json');
  const input = JSON.parse(await fs.promises.readFile(seedPath, 'utf8'));
  const topics = input.topics ?? [input];
  await mongoose.connect(mongoUri);

  let topicCount = 0;
  let exerciseCount = 0;

  for (const item of topics) {
    const topic = await GrammarTopic.findOneAndUpdate(
      { slug: item.topic.slug },
      { $set: item.topic },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    );

    for (const exercise of item.exercises) {
      await GrammarExercise.findOneAndUpdate(
        { topicId: topic._id, order: exercise.order },
        { $set: { ...exercise, topicId: topic._id } },
        { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
      );
      exerciseCount += 1;
    }

    topicCount += 1;
  }

  console.log(`Seeded ${topicCount} grammar topics with ${exerciseCount} exercises`);
};

seed()
  .catch(error => {
    console.error('Unable to seed grammar content:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
