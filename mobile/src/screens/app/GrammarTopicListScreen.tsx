import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Typography } from '../../constants/typography';
import { useGrammarStore } from '../../stores/grammarStore';
import { useThemeStore } from '../../stores/themeStore';

const GrammarTopicListScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useThemeStore();
  const { topics, isLoadingTopics, error, loadTopics } = useGrammarStore();

  useEffect(() => {
    loadTopics().catch(() => undefined);
  }, [loadTopics]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={27} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Grammar</Text>
        <TouchableOpacity onPress={() => loadTopics()} style={styles.headerButton}>
          <Ionicons name="refresh" size={21} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={[styles.eyebrow, { color: colors.accent }]}>GRAMMAR HUB</Text>
          <Text style={[styles.title, { color: colors.text }]}>Chọn chủ điểm để học</Text>
          <Text style={[styles.description, { color: colors.textMuted }]}>
            Mỗi bài gồm lý thuyết ngắn, ví dụ song ngữ và bài tập có giải thích lỗi sai.
          </Text>
        </View>

        {isLoadingTopics ? (
          <View style={styles.centerBlock}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[styles.status, { color: colors.textMuted }]}>
              Đang tải danh sách ngữ pháp...
            </Text>
          </View>
        ) : null}

        {!isLoadingTopics && error ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Không tải được danh sách</Text>
            <Text style={[styles.status, { color: colors.textMuted }]}>{error}</Text>
            <TouchableOpacity onPress={() => loadTopics()}>
              <Text style={[styles.retry, { color: colors.accent }]}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!isLoadingTopics && !error && topics.map(topic => (
          <TouchableOpacity
            key={topic.id}
            activeOpacity={0.86}
            onPress={() => navigation.navigate('GrammarTheoryScreen', { topicId: topic.id })}
            style={[styles.topicCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={styles.topicHeader}>
              <View style={styles.topicMeta}>
                <Text style={[styles.tag, { color: colors.accent }]}>{topic.level}</Text>
                <Text style={[styles.tag, { color: colors.textMuted }]}>{topic.category}</Text>
              </View>
              <Ionicons name="chevron-forward" size={21} color={colors.textMuted} />
            </View>
            <Text style={[styles.topicTitle, { color: colors.text }]}>{topic.title}</Text>
            {topic.description ? (
              <Text style={[styles.topicDescription, { color: colors.textMuted }]}>
                {topic.description}
              </Text>
            ) : null}
            <Text style={[styles.exerciseCount, { color: colors.warning }]}>
              {topic.exerciseCount} bài tập
            </Text>
          </TouchableOpacity>
        ))}

        {!isLoadingTopics && !error && topics.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Chưa có chủ điểm</Text>
            <Text style={[styles.status, { color: colors.textMuted }]}>
              Hãy seed thêm nội dung Grammar rồi quay lại nhé.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 14,
    paddingHorizontal: 18,
    paddingTop: 52,
  },
  headerButton: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  headerTitle: {
    flex: 1,
    fontFamily: Typography.fontFamily.bold,
    fontSize: 20,
  },
  content: {
    gap: 14,
    padding: 18,
    paddingBottom: 42,
  },
  hero: {
    gap: 8,
    marginBottom: 4,
  },
  eyebrow: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 31,
    lineHeight: 37,
  },
  description: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  topicCard: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 9,
    padding: 16,
  },
  topicHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topicMeta: {
    flexDirection: 'row',
    gap: 10,
  },
  tag: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  topicTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 21,
  },
  topicDescription: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  exerciseCount: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 13,
  },
  centerBlock: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 28,
  },
  emptyCard: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
    padding: 18,
  },
  emptyTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 18,
  },
  status: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  retry: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 15,
    marginTop: 6,
  },
});

export default GrammarTopicListScreen;
