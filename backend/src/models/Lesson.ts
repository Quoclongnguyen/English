import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILesson extends Document {
  type: 'listening';
  title: string;
  description?: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  topic: string;
  thumbnailUrl?: string;
  durationMs: number;
  audioTrackId: Types.ObjectId;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    type: { type: String, enum: ['listening'], default: 'listening' },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    level: {
      type: String,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1'],
      required: true,
    },
    topic: { type: String, required: true, trim: true },
    thumbnailUrl: { type: String, trim: true },
    durationMs: { type: Number, required: true, min: 1 },
    audioTrackId: {
      type: Schema.Types.ObjectId,
      ref: 'AudioTrack',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

LessonSchema.index({ type: 1, level: 1, status: 1 });

export const Lesson = mongoose.model<ILesson>('Lesson', LessonSchema);
