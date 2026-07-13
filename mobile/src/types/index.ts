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

export type VocabularyTopic =
  | 'daily-life'
  | 'work'
  | 'study'
  | 'school'
  | 'family'
  | 'home'
  | 'food'
  | 'travel'
  | 'transport'
  | 'shopping'
  | 'health'
  | 'technology'
  | 'business'
  | 'nature'
  | 'emotion'
  | 'other';

export interface Word {
  _id: string;
  word: string;
  phonetic: string;
  type: string;
  meaning_vi: string;
  example: string;
  story?: string;
  audioUrl?: string;
  topic: VocabularyTopic;
  topicSource?: 'manual' | 'gemini' | 'seed' | 'fallback';
  level: string;
  source: 'daily' | 'camera' | 'listening';
  progress?: UserWordProgress;
}

export interface DailyVocabResponse {
  words: Word[];
  story: string;
  streak: number;
  message?: string;
}

// Profile & gamification

export interface UserBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  rarity: 'common' | 'uncommon' | 'rare';
  requirement: {
    type: 'streak' | 'vocabulary' | 'photoScans';
    value: number;
  };
  currentProgress: number;
  progress: number;
}

export interface WeeklyProgressDay {
  dayName: string;
  date: string;
  xpEarned: number;
  wordsLearned: number;
  studied: boolean;
}

export interface UserStats {
  currentStreak: number;
  streakFreezes: number;
  totalXP: number;
  availableXP: number;
  level: number;
  vocabulary: {
    total: number;
    mastered: number;
  };
  todayStudied: boolean;
  badges: UserBadge[];
  weeklyProgress: WeeklyProgressDay[];
}

export interface CameraWord {
  word: string;
  phonetic: string;
  meaning_vi: string;
  example: string;
  topic?: VocabularyTopic;
}

export interface PhotoScanResult {
  photoScanId: string;
  photoUrl: string;
  localImageUri: string;
  story: string;
  words: CameraWord[];
  fromCache: boolean;
}

export interface SaveCameraWordsResponse {
  success: boolean;
  newWordsCount: number;
  duplicatesCount: number;
  xpEarned: number;
  message: string;
  totalVocab: number;
}

export interface PhotoDeckWord extends CameraWord {
  type: string;
}

export interface PhotoDeckItem {
  _id: string;
  photoUrl: string;
  story: string;
  savedWords: string[];
  words: PhotoDeckWord[];
  xpEarned: number;
  createdAt: string;
}

export interface PhotoDeckFilters {
  sort: 'recent' | 'oldest' | 'alphabetical';
  search?: string;
  page: number;
  limit?: number;
}

export interface PhotoDeckResponse {
  data: PhotoDeckItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Listening

export interface TranscriptWord {
  id: string;
  text: string;
  normalizedText: string;
  startMs: number;
  endMs: number;
  isSaveable: boolean;
  phonetic?: string;
  type?: string;
  meaningVi?: string;
  example?: string;
}

export interface TranscriptSegment {
  id: string;
  text: string;
  translationVi?: string;
  startMs: number;
  endMs: number;
  words: TranscriptWord[];
}

export interface ListeningLesson {
  id: string;
  title: string;
  description?: string;
  level: User['level'];
  topic: string;
  thumbnailUrl?: string;
  durationMs: number;
  audioUrl: string;
  transcript: TranscriptSegment[];
}

export interface SaveListeningWordResponse {
  word: Word;
  progress: UserWordProgress;
  alreadySaved: boolean;
}

// Reading

export interface ReadingSection {
  id: string;
  order: number;
  english: string;
  vietnamese: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  description?: string;
  level: User['level'];
  topic: string;
  thumbnailUrl?: string;
  estimatedReadingMinutes: number;
  sections: ReadingSection[];
  hasSummary: boolean;
}

export interface ReadingExplanation {
  explanationVi: string;
  simplifiedEnglish: string;
  difficultWords: Array<{ word: string; meaningVi: string }>;
  grammarNotes: string[];
  fromCache: boolean;
}

export interface ReadingSummary {
  english: string;
  vietnamese: string;
  fromCache: boolean;
}

// Grammar

export interface GrammarExample {
  english: string;
  vietnamese: string;
}

export interface GrammarUsage {
  id: string;
  title: string;
  explanation: string;
  examples: GrammarExample[];
}

export interface GrammarStructure {
  id: string;
  label: 'affirmative' | 'negative' | 'question' | 'other';
  formula: string;
  explanation?: string;
  examples: GrammarExample[];
}

export interface GrammarTopic {
  id: string;
  title: string;
  slug: string;
  description?: string;
  level: User['level'];
  category: 'tense' | 'modal' | 'conditional' | 'comparison' | 'other';
  order: number;
  theory: {
    overview: string;
    usages: GrammarUsage[];
    structures: GrammarStructure[];
    notes: string[];
  };
  exerciseCount: number;
}

export type GrammarTopicSummary = Omit<GrammarTopic, 'theory'>;

export type GrammarExerciseType = 'multiple_choice' | 'fill_blank';

export interface GrammarOption {
  id: string;
  text: string;
}

export interface GrammarExercise {
  id: string;
  topicId: string;
  type: GrammarExerciseType;
  order: number;
  level: User['level'];
  question: string;
  sentence?: string;
  options?: GrammarOption[];
}

export interface GrammarSubmitResponse {
  exerciseId: string;
  isCorrect: boolean;
  submittedAnswer: string;
  correctAnswer: string;
  correctAnswerText: string;
  explanation: {
    rule: string;
    correctReason: string;
    mistakeReason?: string;
  };
}

// Beta feedback

export type FeedbackModule =
  | 'general'
  | 'vocabulary'
  | 'camera'
  | 'listening'
  | 'reading'
  | 'grammar';

export interface SubmitFeedbackPayload {
  module: FeedbackModule;
  rating: number;
  message: string;
  platform?: string;
  appVersion?: string;
  deviceModel?: string;
}

export interface FeedbackItem extends SubmitFeedbackPayload {
  id: string;
  status: 'new' | 'reviewed' | 'resolved';
  createdAt: string;
}

