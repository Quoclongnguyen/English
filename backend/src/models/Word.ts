import mongoose, { Document, Schema } from 'mongoose';

export interface IWord extends Document {
  word: string;
  phonetic: string;
  type: string;
  meaning_vi: string;
  example: string;
  story?: string;
  audioUrl?: string;
  topic: string;
  level: string;
  source: 'daily' | 'camera';
  photoRef?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WordSchema = new Schema<IWord>(
  {
    word: { type: String, required: true, trim: true },
    phonetic: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    meaning_vi: { type: String, required: true, trim: true },
    example: { type: String, required: true, trim: true },
    story: { type: String },
    audioUrl: { type: String },
    topic: { type: String, required: true },
    level: { type: String, required: true },
    source: { type: String, enum: ['daily', 'camera'], default: 'daily' },
    photoRef: { type: String },
  },
  { timestamps: true }
);

// Add index on word for faster lookups and ensuring uniqueness if needed,
// though it might not be strictly unique if a word can have multiple meanings.
WordSchema.index({ word: 1 });
WordSchema.index({ level: 1, topic: 1 });

export const Word = mongoose.model<IWord>('Word', WordSchema);
