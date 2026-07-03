import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUserVocab {
  word: string;
  source: 'photo' | 'review';
  photoScanId?: Types.ObjectId;
  learnedAt: Date;
  mastered: boolean;
  reviewCount: number;
}

export interface IUserBadge {
  badgeId: string;
  unlockedAt: Date;
  isActive: boolean;
}

export interface IStudyHistory {
  date: Date;
  xpEarned: number;
  wordsLearned: number;
  photosScanned: number;
}

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
  
  // Spendable XP & Current Streak Count (legacy fields kept for compatibility)
  xp: number;
  streak: number;

  // Streak & Freezes (New Phase 3 fields)
  currentStreak: {
    count: number;
    lastStudyDate?: Date;
    frozenAt?: Date;
  };
  streakFreezes: number;

  // Unified Vocabulary
  vocabulary: Types.DocumentArray<IUserVocab & Document>;

  // Gamification (New Phase 3 fields)
  totalXP: number;
  totalXPSpent: number;
  badges: Types.DocumentArray<IUserBadge & Document>;

  // Study History (New Phase 3 fields)
  studyHistory: IStudyHistory[];

  // Profile fields requested by spec
  displayName?: string;
  avatarUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}

const UserVocabSchema = new Schema({
  word: { type: String, required: true, lowercase: true, trim: true },
  source: { type: String, enum: ['photo', 'review'], default: 'review' },
  photoScanId: { type: Schema.Types.ObjectId, ref: 'PhotoScan', sparse: true },
  learnedAt: { type: Date, default: Date.now },
  mastered: { type: Boolean, default: false },
  reviewCount: { type: Number, default: 0 }
});

const UserBadgeSchema = new Schema({
  badgeId: { type: String, required: true },
  unlockedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const StudyHistorySchema = new Schema({
  date: { type: Date, required: true, index: true },
  xpEarned: { type: Number, default: 0 },
  wordsLearned: { type: Number, default: 0 },
  photosScanned: { type: Number, default: 0 }
});

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
    
    // New fields
    currentStreak: {
      count: { type: Number, default: 0 },
      lastStudyDate: Date,
      frozenAt: Date
    },
    streakFreezes: { type: Number, default: 0 },
    vocabulary: [UserVocabSchema],
    totalXP: { type: Number, default: 0 },
    totalXPSpent: { type: Number, default: 0 },
    badges: [UserBadgeSchema],
    studyHistory: [StudyHistorySchema],
    displayName: { type: String },
    avatarUrl: { type: String }
  },
  { timestamps: true }
);

// Indexes
UserSchema.path('vocabulary').index({ word: 1 });

// Mongoose Pre-Save hook to synchronize legacy and Phase 3 fields
UserSchema.pre('save', function (next) {
  // Sync XP
  if (this.isModified('xp') && !this.isModified('totalXP')) {
    // If legacy code directly modifies 'xp', adjust totalXP
    this.totalXP = this.xp + this.totalXPSpent;
  } else {
    // Sync available/spendable 'xp'
    this.xp = this.totalXP - this.totalXPSpent;
  }

  // Sync Streak
  if (this.isModified('streak') && !this.isModified('currentStreak.count')) {
    this.currentStreak.count = this.streak;
  } else {
    this.streak = this.currentStreak.count;
  }

  // Sync name/displayName
  if (this.isModified('name') && !this.isModified('displayName')) {
    this.displayName = this.name;
  } else if (this.isModified('displayName') && !this.isModified('name')) {
    this.name = this.displayName || this.name;
  }

  // Sync avatar/avatarUrl
  if (this.isModified('avatar') && !this.isModified('avatarUrl')) {
    this.avatarUrl = this.avatar;
  } else if (this.isModified('avatarUrl') && !this.isModified('avatar')) {
    this.avatar = this.avatarUrl || this.avatar;
  }

  next();
});

export const User = mongoose.model<IUser>('User', UserSchema);

