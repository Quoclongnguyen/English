import mongoose, { Document, Schema, Types } from 'mongoose';

export type FeedbackModule =
  | 'general'
  | 'vocabulary'
  | 'camera'
  | 'listening'
  | 'reading'
  | 'grammar';

export interface IFeedback extends Document {
  userId: Types.ObjectId;
  module: FeedbackModule;
  rating: number;
  message: string;
  platform?: string;
  appVersion?: string;
  deviceModel?: string;
  status: 'new' | 'reviewed' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    module: {
      type: String,
      enum: ['general', 'vocabulary', 'camera', 'listening', 'reading', 'grammar'],
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    platform: { type: String, trim: true, maxlength: 50 },
    appVersion: { type: String, trim: true, maxlength: 50 },
    deviceModel: { type: String, trim: true, maxlength: 120 },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'resolved'],
      default: 'new',
    },
  },
  { timestamps: true }
);

FeedbackSchema.index({ status: 1, createdAt: -1 });
FeedbackSchema.index({ module: 1, createdAt: -1 });

export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);
