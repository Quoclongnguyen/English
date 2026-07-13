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

export const getVocabularyTopicLabel = (topic?: string) => {
  if (!topic) return VOCABULARY_TOPIC_LABELS.other;
  return VOCABULARY_TOPIC_LABELS[topic as VocabularyTopic] ?? VOCABULARY_TOPIC_LABELS.other;
};
