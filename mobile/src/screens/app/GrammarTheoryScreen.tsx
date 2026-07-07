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
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { TheorySection } from '../../components/grammar/TheorySection';
import { SAMPLE_GRAMMAR_TOPIC_ID } from '../../constants/config';
import { Typography } from '../../constants/typography';
import { useGrammarStore } from '../../stores/grammarStore';
import { useThemeStore } from '../../stores/themeStore';

const GrammarTheoryContent = () => {
  const navigation = useNavigation<any>();
  const { colors } = useThemeStore();
  const { topic } = useGrammarStore();

  if (!topic) return null;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={27} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Grammar</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.tags}>
            <Text style={[styles.tag, { color: colors.accent }]}>{topic.level}</Text>
            <Text style={[styles.tag, { color: colors.textMuted }]}>{topic.category}</Text>
            <Text style={[styles.tag, { color: colors.textMuted }]}>
              {topic.exerciseCount} bài tập
            </Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{topic.title}</Text>
          {topic.description ? (
            <Text style={[styles.description, { color: colors.textMuted }]}>
              {topic.description}
            </Text>
          ) : null}
        </View>

        <TheorySection topic={topic} />

        <Button
          title="Làm bài tập"
          color="purple"
          onPress={() => navigation.navigate('GrammarExerciseScreen', { topicId: topic.id })}
          style={styles.exerciseButton}
          icon={<Ionicons name="school-outline" size={20} color="#FFFFFF" />}
        />
      </ScrollView>
    </View>
  );
};

const GrammarTheoryScreen = () => {
  const route = useRoute<any>();
  const { colors } = useThemeStore();
  const { topic, isLoadingTopic, error, loadTopic, clear } = useGrammarStore();
  const topicId = route.params?.topicId ?? SAMPLE_GRAMMAR_TOPIC_ID;

  useEffect(() => {
    loadTopic(topicId).catch(() => undefined);
    return clear;
  }, [clear, loadTopic, topicId]);

  if (isLoadingTopic) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.status, { color: colors.textMuted }]}>
          Đang tải bài ngữ pháp...
        </Text>
      </View>
    );
  }

  if (error || !topic) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          Không mở được bài ngữ pháp
        </Text>
        <Text style={[styles.status, { color: colors.textMuted }]}>{error}</Text>
        <TouchableOpacity onPress={() => loadTopic(topicId)}>
          <Text style={[styles.retry, { color: colors.accent }]}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <GrammarTheoryContent />;
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
  headerSpacer: {
    width: 38,
  },
  content: {
    gap: 16,
    padding: 18,
    paddingBottom: 42,
  },
  hero: {
    gap: 8,
    marginBottom: 4,
  },
  tags: {
    flexDirection: 'row',
    gap: 12,
  },
  tag: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 32,
    lineHeight: 38,
  },
  description: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  exerciseButton: {
    marginTop: 4,
  },
  center: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 30,
  },
  status: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
    textAlign: 'center',
  },
  errorTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 21,
    textAlign: 'center',
  },
  retry: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 15,
    marginTop: 8,
  },
});

export default GrammarTheoryScreen;
