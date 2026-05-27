import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  appleId?: string;
  avatar?: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  goal: 'ielts' | 'toeic' | 'business' | 'daily';
  dailyTarget: 5 | 7 | 10;
  xp: number;
  streak: number;
  streakFreezeCount: number;
  lastStudyDate?: Date;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    googleId: { type: String, sparse: true },
    appleId: { type: String, sparse: true },
    avatar: { type: String },
    level: {
      type: String,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1'],
      default: 'A1',
    },
    goal: {
      type: String,
      enum: ['ielts', 'toeic', 'business', 'daily'],
      default: 'daily',
    },
    dailyTarget: {
      type: Number,
      enum: [5, 7, 10],
      default: 7,
    },
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    streakFreezeCount: { type: Number, default: 0 },
    lastStudyDate: { type: Date },
  },
  { timestamps: true }
);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ googleId: 1 }, { sparse: true });
UserSchema.index({ appleId: 1 }, { sparse: true });

export const User = mongoose.model<IUser>('User', UserSchema);
