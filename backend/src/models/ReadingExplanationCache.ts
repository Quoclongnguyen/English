import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IDifficultWord {
  word: string;
  meaningVi: string;
}

export interface IReadingExplanationCache extends Document {
  passageId: Types.ObjectId;
  sectionId: string;
  level: string;
  explanationVi: string;
  simplifiedEnglish: string;
  difficultWords: IDifficultWord[];
  grammarNotes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DifficultWordSchema = new Schema<IDifficultWord>(
  {
    word: { type: String, required: true, trim: true },
    meaningVi: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ReadingExplanationCacheSchema = new Schema<IReadingExplanationCache>(
  {
    passageId: {
      type: Schema.Types.ObjectId,
      ref: 'ReadingPassage',
      required: true,
    },
    sectionId: { type: String, required: true },
    level: { type: String, required: true },
    explanationVi: { type: String, required: true },
    simplifiedEnglish: { type: String, required: true },
    difficultWords: { type: [DifficultWordSchema], default: [] },
    grammarNotes: { type: [String], default: [] },
  },
  { timestamps: true }
);

ReadingExplanationCacheSchema.index(
  { passageId: 1, sectionId: 1, level: 1 },
  { unique: true }
);

export const ReadingExplanationCache =
  mongoose.model<IReadingExplanationCache>(
    'ReadingExplanationCache',
    ReadingExplanationCacheSchema
  );
