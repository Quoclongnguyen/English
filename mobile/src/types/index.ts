// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  goal: 'ielts' | 'toeic' | 'business' | 'daily';
  dailyTarget: 5 | 7 | 10;
  xp: number;
  streak: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  message?: string;
}

// Onboarding

export type LearningGoal = 'ielts' | 'toeic' | 'business' | 'daily';
export type DailyTarget = 5 | 7 | 10;
export type PlacementLevel = 'A1' | 'A2' | 'B1' | 'B2';

export interface PlacementQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface OnboardingProfile {
  goal: LearningGoal | null;
  dailyTarget: DailyTarget | null;
  level: PlacementLevel | null;
  isCompleted: boolean;
}

// Vocabulary 

export interface UserWordProgress {
  _id: string;
  userId: string;
  wordId: string;
  status: 'new' | 'learning' | 'reviewing' | 'mastered';
  nextReviewDate: string;
  reviewCount: number;
  easeFactor: number;
  interval: number;
  lastResult?: 'correct' | 'wrong';
}

export interface Word {
  _id: string;
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
  progress?: UserWordProgress;
}

export interface DailyVocabResponse {
  words: Word[];
  story: string;
  streak: number;
  message?: string;
}

