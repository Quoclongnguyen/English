import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { AudioTrack } from '../models/AudioTrack';
import { Lesson } from '../models/Lesson';

const seed = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI is required');

  const seedPath = path.join(__dirname, '../seeds/listening.sample.json');
  const input = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

  await mongoose.connect(mongoUri);

  const existingLesson = await Lesson.findOne({
    type: 'listening',
    title: input.lesson.title,
  });
  if (existingLesson) {
    console.log(`Listening lesson already exists: ${existingLesson._id}`);
    return;
  }

  const audioTrack = await AudioTrack.create(input.audioTrack);
  const lesson = await Lesson.create({
    ...input.lesson,
    type: 'listening',
    audioTrackId: audioTrack._id,
  });

  console.log(`Created listening lesson: ${lesson._id}`);
};

seed()
  .catch(error => {
    console.error('Unable to seed listening lesson:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
