import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { ReadingPassage } from '../models/ReadingPassage';

const seed = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI is required');

  const seedPath = path.join(__dirname, '../seeds/reading.sample.json');
  const input = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  await mongoose.connect(mongoUri);

  const existing = await ReadingPassage.findOne({ title: input.title });
  if (existing) {
    console.log(`Reading passage already exists: ${existing._id}`);
    return;
  }

  const passage = await ReadingPassage.create(input);
  console.log(`Created reading passage: ${passage._id}`);
};

seed()
  .catch(error => {
    console.error('Unable to seed reading passage:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
