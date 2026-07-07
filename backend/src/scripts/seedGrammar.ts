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
  await mongoose.connect(mongoUri);

  const topic = await GrammarTopic.findOneAndUpdate(
    { slug: input.topic.slug },
    { $set: input.topic },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
  );

  for (const exercise of input.exercises) {
    await GrammarExercise.findOneAndUpdate(
      { topicId: topic._id, order: exercise.order },
      { $set: { ...exercise, topicId: topic._id } },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    );
  }

  console.log(`Seeded grammar topic ${topic._id} with ${input.exercises.length} exercises`);
};

seed()
  .catch(error => {
    console.error('Unable to seed grammar content:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
