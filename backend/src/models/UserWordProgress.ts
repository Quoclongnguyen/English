import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUserWordProgress extends Document {
  userId: Types.ObjectId;
  wordId: Types.ObjectId;
  status: 'new' | 'learning' | 'reviewing' | 'mastered';
  nextReviewDate: Date;
  reviewCount: number;
  easeFactor: number;
  interval: number;
  lastResult?: 'correct' | 'wrong';
  createdAt: Date;
  updatedAt: Date;
}

const UserWordProgressSchema = new Schema<IUserWordProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    wordId: { type: Schema.Types.ObjectId, ref: 'Word', required: true },
    status: {
      type: String,
      enum: ['new', 'learning', 'reviewing', 'mastered'],
      default: 'new',
    },
    nextReviewDate: { type: Date, default: Date.now },
    reviewCount: { type: Number, default: 0 },
    easeFactor: { type: Number, default: 2.5 }, // SM-2 default ease factor
    interval: { type: Number, default: 0 }, // Interval in days
    lastResult: { type: String, enum: ['correct', 'wrong'] },
  },
  { timestamps: true }
);

// A user can only have one progress record per word
UserWordProgressSchema.index({ userId: 1, wordId: 1 }, { unique: true });
// Optimize queries for getting words due for review today
UserWordProgressSchema.index({ userId: 1, nextReviewDate: 1, status: 1 });

export const UserWordProgress = mongoose.model<IUserWordProgress>('UserWordProgress', UserWordProgressSchema);
