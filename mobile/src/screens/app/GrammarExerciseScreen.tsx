import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { ExerciseQuestion } from '../../components/grammar/ExerciseQuestion';
import { SAMPLE_GRAMMAR_TOPIC_ID } from '../../constants/config';
import { Typography } from '../../constants/typography';
import { useGrammarStore } from '../../stores/grammarStore';
import { useThemeStore } from '../../stores/themeStore';

const GrammarExerciseScreen = () => {
  const navigation = useNavigation();
  const { colors } = useThemeStore();
  const {
    exercises,
    answers,
    isLoadingExercises,
    isSubmitting,
    error,
    loadExercises,
    submitAnswer,
  } = useGrammarStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadExercises(SAMPLE_GRAMMAR_TOPIC_ID).catch(() => undefined);
  }, [loadExercises]);

  const currentExercise = exercises[currentIndex];
  const currentResult = currentExercise ? answers[currentExercise.id] : undefined;
  const correctCount = useMemo(
    () => Object.values(answers).filter(answer => answer.isCorrect).length,
    [answers],
  );
  const completedCount = Object.keys(answers).length;
  const isComplete = exercises.length > 0 && completedCount === exercises.length;

  const handleSubmit = async (answer: string) => {
    if (!currentExercise) return;
    try {
      await submitAnswer(currentExercise.id, answer);
    } catch (submitError) {
      Alert.alert(
        'Không thể chấm đáp án',
        submitError instanceof Error ? submitError.message : 'Vui lòng thử lại.',
      );
    }
  };

  const goNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(index => index + 1);
    }
  };

  if (isLoadingExercises) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.status, { color: colors.textMuted }]}>
          Đang tải bài tập...
        </Text>
      </View>
    );
  }

  if (error || !currentExercise) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          Không mở được bài tập
        </Text>
        <Text style={[styles.status, { color: colors.textMuted }]}>{error}</Text>
        <TouchableOpacity onPress={() => loadExercises(SAMPLE_GRAMMAR_TOPIC_ID)}>
          <Text style={[styles.retry, { color: colors.accent }]}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={27} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Grammar Exercise</Text>
        <Text style={[styles.progressText, { color: colors.textMuted }]}>
          {currentIndex + 1}/{exercises.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.progressBarWrap}>
          <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.accent,
                  width: `${((currentIndex + 1) / exercises.length) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.caption, { color: colors.textMuted }]}>
            Làm từng câu, xem giải thích ngay sau khi trả lời.
          </Text>
        </View>

        <ExerciseQuestion
          exercise={currentExercise}
          result={currentResult}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />

        {currentResult && currentIndex < exercises.length - 1 ? (
          <Button title="Câu tiếp theo" color="purple" onPress={goNext} />
        ) : null}

        {isComplete ? (
          <View style={[styles.summary, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="trophy-outline" size={28} color={colors.xp} />
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Hoàn thành!</Text>
            <Text style={[styles.summaryText, { color: colors.textMuted }]}>
              Bạn trả lời đúng {correctCount}/{exercises.length} câu. Quay lại lý thuyết nếu muốn ôn
              nhanh trước vòng sau.
            </Text>
            <Button
              title="Quay lại lý thuyết"
              variant="outline"
              color="purple"
              onPress={() => navigation.goBack()}
            />
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
  progressText: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 12,
  },
  content: {
    gap: 16,
    padding: 18,
    paddingBottom: 42,
  },
  progressBarWrap: {
    gap: 8,
  },
  progressTrack: {
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 999,
    height: 8,
  },
  caption: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  summary: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    padding: 18,
  },
  summaryTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 22,
  },
  summaryText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
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

export default GrammarExerciseScreen;
