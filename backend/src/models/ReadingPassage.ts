import mongoose, { Document, Schema } from 'mongoose';

export interface IReadingSection {
  id: string;
  order: number;
  english: string;
  vietnamese: string;
}

export interface IReadingSummary {
  english: string;
  vietnamese: string;
  generatedBy: 'editor' | 'gemini';
  generatedAt?: Date;
}

export interface IReadingPassage extends Document {
  title: string;
  description?: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  topic: string;
  thumbnailUrl?: string;
  estimatedReadingMinutes: number;
  sections: IReadingSection[];
  summary?: IReadingSummary;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const ReadingSectionSchema = new Schema<IReadingSection>(
  {
    id: { type: String, required: true },
    order: { type: Number, required: true, min: 0 },
    english: { type: String, required: true, trim: true },
    vietnamese: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ReadingSummarySchema = new Schema<IReadingSummary>(
  {
    english: { type: String, required: true, trim: true },
    vietnamese: { type: String, required: true, trim: true },
    generatedBy: { type: String, enum: ['editor', 'gemini'], required: true },
    generatedAt: Date,
  },
  { _id: false }
);

const ReadingPassageSchema = new Schema<IReadingPassage>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    level: {
      type: String,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1'],
      required: true,
    },
    topic: { type: String, required: true, trim: true },
    thumbnailUrl: { type: String, trim: true },
    estimatedReadingMinutes: { type: Number, required: true, min: 1 },
    sections: {
      type: [ReadingSectionSchema],
      required: true,
      validate: {
        validator: (sections: IReadingSection[]) => sections.length > 0,
        message: 'A reading passage needs at least one section',
      },
    },
    summary: ReadingSummarySchema,
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

ReadingPassageSchema.index({ level: 1, topic: 1, status: 1 });

export const ReadingPassage = mongoose.model<IReadingPassage>(
  'ReadingPassage',
  ReadingPassageSchema
);
