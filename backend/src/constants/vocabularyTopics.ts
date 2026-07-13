export const VOCABULARY_TOPICS = [
  'daily-life',
  'work',
  'study',
  'school',
  'family',
  'home',
  'food',
  'travel',
  'transport',
  'shopping',
  'health',
  'technology',
  'business',
  'nature',
  'emotion',
  'other',
] as const;

export type VocabularyTopic = (typeof VOCABULARY_TOPICS)[number];

export const VOCABULARY_TOPIC_LABELS: Record<VocabularyTopic, string> = {
  'daily-life': 'Daily Life',
  work: 'Work',
  study: 'Study',
  school: 'School',
  family: 'Family',
  home: 'Home',
  food: 'Food',
  travel: 'Travel',
  transport: 'Transport',
  shopping: 'Shopping',
  health: 'Health',
  technology: 'Technology',
  business: 'Business',
  nature: 'Nature',
  emotion: 'Emotion',
  other: 'Other',
};

const topicSet = new Set<string>(VOCABULARY_TOPICS);

export const normalizeVocabularyTopic = (topic?: string | null): VocabularyTopic => {
  if (!topic) return 'other';
  const normalized = topic.trim().toLowerCase();
  return topicSet.has(normalized) ? (normalized as VocabularyTopic) : 'other';
};
