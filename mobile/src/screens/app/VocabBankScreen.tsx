import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useVocabStore } from '../../../src/stores/vocabStore';
import { useThemeStore } from '../../../src/stores/themeStore';
import { Typography } from '../../../src/constants/typography';
import { Badge } from '../../../src/components/Badge';
import { PhotoDeckView } from '../../../src/components/PhotoDeckView';
import {
  getVocabularyTopicLabel,
  VocabularyTopic,
  VOCABULARY_TOPICS,
} from '../../../src/constants/vocabularyTopics';

type BankTab = 'vocabulary' | 'photos';

const VocabBankScreen = () => {
  const navigation = useNavigation<any>();
  const { vocabBank, fetchVocabBank, isLoading } = useVocabStore();
  const { colors } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<BankTab>('vocabulary');
  const [selectedTopic, setSelectedTopic] = useState<VocabularyTopic | 'all'>('all');

  useEffect(() => {
    fetchVocabBank(selectedTopic === 'all' ? undefined : { topic: selectedTopic });
  }, [fetchVocabBank, selectedTopic]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVocabBank(selectedTopic === 'all' ? undefined : { topic: selectedTopic });
    setRefreshing(false);
  };

  const topicOptions = [
    'all' as const,
    ...VOCABULARY_TOPICS.filter(topic =>
      topic === selectedTopic || vocabBank.some(word => word.topic === topic),
    ),
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={25} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Vocab Bank</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Từ đã học và những câu chuyện qua ảnh
        </Text>
        <View style={[styles.tabs, { backgroundColor: colors.surface }]}>
          <Text
            onPress={() => setActiveTab('vocabulary')}
            style={[
              styles.tab,
              { color: activeTab === 'vocabulary' ? colors.background : colors.textMuted },
              activeTab === 'vocabulary' && { backgroundColor: colors.primary },
            ]}
          >
            Từ vựng · {vocabBank.length}
          </Text>
          <Text
            onPress={() => setActiveTab('photos')}
            style={[
              styles.tab,
              { color: activeTab === 'photos' ? '#FFFFFF' : colors.textMuted },
              activeTab === 'photos' && { backgroundColor: colors.accent },
            ]}
          >
            Photo Deck
          </Text>
        </View>

        {activeTab === 'vocabulary' ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topicChips}
          >
            {topicOptions.map(topic => {
              const active = selectedTopic === topic;
              return (
                <Text
                  key={topic}
                  onPress={() => setSelectedTopic(topic)}
                  style={[
                    styles.topicChip,
                    {
                      backgroundColor: active ? colors.accent : colors.surface,
                      borderColor: active ? colors.accent : colors.border,
                      color: active ? '#FFFFFF' : colors.textMuted,
                    },
                  ]}
                >
                  {topic === 'all' ? 'All' : getVocabularyTopicLabel(topic)}
                </Text>
              );
            })}
          </ScrollView>
        ) : null}
      </View>

      {activeTab === 'vocabulary' ? (
        <ScrollView
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing || isLoading} onRefresh={onRefresh} />
          }
        >
          {vocabBank.length === 0 && !isLoading && (
            <Text style={[styles.empty, { color: colors.textMuted }]}>
              Chưa có từ nào. Hãy bắt đầu với Daily Vocab hoặc Camera!
            </Text>
          )}

          {vocabBank.map(word => (
            <View
              key={word._id}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.word, { color: colors.text }]}>{word.word}</Text>
                <View style={styles.badges}>
                  <Badge
                    label={getVocabularyTopicLabel(word.topic)}
                    color="purple"
                  />
                  <Badge
                    label={word.progress?.status === 'mastered' ? 'Mastered' : 'Learning'}
                    color={word.progress?.status === 'mastered' ? 'green' : 'yellow'}
                  />
                </View>
              </View>
              <Text style={[styles.phonetic, { color: colors.textMuted }]}>{word.phonetic}</Text>
              <Text style={[styles.meaning, { color: colors.text }]}>{word.meaning_vi}</Text>
              <Text style={[styles.example, { color: colors.textMuted }]}>{word.example}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <PhotoDeckView />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    borderBottomWidth: 1,
    padding: 24,
    paddingTop: 48,
  },
  headerTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  backButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    marginLeft: -8,
    width: 36,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 28,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
    marginTop: 4,
  },
  tabs: {
    borderRadius: 16,
    flexDirection: 'row',
    marginTop: 18,
    padding: 4,
  },
  topicChips: {
    gap: 8,
    paddingTop: 14,
  },
  topicChip: {
    borderRadius: 999,
    borderWidth: 1,
    fontFamily: Typography.fontFamily.bold,
    fontSize: 12,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tab: {
    borderRadius: 12,
    flex: 1,
    fontFamily: Typography.fontFamily.bold,
    fontSize: 13,
    overflow: 'hidden',
    paddingVertical: 10,
    textAlign: 'center',
  },
  list: {
    gap: 12,
    padding: 16,
  },
  empty: {
    fontFamily: Typography.fontFamily.regular,
    marginTop: 40,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    padding: 16,
  },
  cardHeader: {
    gap: 8,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  word: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 20,
  },
  phonetic: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 12,
  },
  meaning: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 16,
    marginTop: 4,
  },
  example: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default VocabBankScreen;
