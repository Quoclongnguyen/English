import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GrammarExercise, GrammarSubmitResponse } from '../../types';
import { Button } from '../Button';
import { AnswerExplanation } from './AnswerExplanation';
import { Typography } from '../../constants/typography';
import { useThemeStore } from '../../stores/themeStore';

interface ExerciseQuestionProps {
  exercise: GrammarExercise;
  result?: GrammarSubmitResponse;
  isSubmitting: boolean;
  onSubmit: (answer: string) => void;
}

export const ExerciseQuestion = ({
  exercise,
  result,
  isSubmitting,
  onSubmit,
}: ExerciseQuestionProps) => {
  const { colors } = useThemeStore();
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [typedAnswer, setTypedAnswer] = useState('');

  useEffect(() => {
    setSelectedAnswer('');
    setTypedAnswer('');
  }, [exercise.id]);

  const isAnswered = Boolean(result);
  const answer = exercise.type === 'multiple_choice' ? selectedAnswer : typedAnswer.trim();
  const canSubmit = answer.length > 0 && !isAnswered;

  return (
    <View style={styles.wrap}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.type, { color: colors.accent }]}>
          {exercise.type === 'multiple_choice' ? 'Multiple choice' : 'Fill in the blank'}
        </Text>
        <Text style={[styles.question, { color: colors.text }]}>{exercise.question}</Text>
        {exercise.sentence ? (
          <Text style={[styles.sentence, { color: colors.textMuted }]}>{exercise.sentence}</Text>
        ) : null}

        {exercise.type === 'multiple_choice' ? (
          <View style={styles.options}>
            {exercise.options?.map(option => {
              const isSelected = selectedAnswer === option.id;
              const isCorrectOption = result?.correctAnswer === option.id;
              const isWrongSelected = isSelected && result && !result.isCorrect;
              const borderColor = isCorrectOption
                ? colors.primary
                : isWrongSelected
                  ? colors.warning
                  : isSelected
                    ? colors.accent
                    : colors.border;

              return (
                <TouchableOpacity
                  key={option.id}
                  activeOpacity={0.85}
                  disabled={isAnswered}
                  onPress={() => setSelectedAnswer(option.id)}
                  style={[
                    styles.option,
                    {
                      borderColor,
                      backgroundColor: isSelected ? `${colors.accent}22` : 'transparent',
                    },
                  ]}
                >
                  <Text style={[styles.optionKey, { color: borderColor }]}>{option.id.toUpperCase()}</Text>
                  <Text style={[styles.optionText, { color: colors.text }]}>{option.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <TextInput
            value={typedAnswer}
            onChangeText={setTypedAnswer}
            editable={!isAnswered}
            autoCapitalize="none"
            placeholder="Nhập đáp án..."
            placeholderTextColor={colors.textMuted}
            style={[
              styles.input,
              {
                borderColor: result?.isCorrect
                  ? colors.primary
                  : result
                    ? colors.warning
                    : colors.border,
                color: colors.text,
              },
            ]}
          />
        )}

        <Button
          title="Chấm đáp án"
          color="purple"
          onPress={() => onSubmit(answer)}
          loading={isSubmitting}
          disabled={!canSubmit}
        />
      </View>

      {result ? <AnswerExplanation result={result} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: 14,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 14,
    padding: 18,
  },
  type: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  question: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 22,
    lineHeight: 29,
  },
  sentence: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 15,
    lineHeight: 23,
  },
  options: {
    gap: 10,
  },
  option: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 10,
    padding: 14,
  },
  optionKey: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 13,
    minWidth: 20,
  },
  optionText: {
    flex: 1,
    fontFamily: Typography.fontFamily.regular,
    fontSize: 15,
    lineHeight: 21,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1.5,
    fontFamily: Typography.fontFamily.bold,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
});
