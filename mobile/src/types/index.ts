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
