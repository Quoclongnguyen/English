import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GrammarSubmitResponse } from '../../types';
import { Typography } from '../../constants/typography';
import { useThemeStore } from '../../stores/themeStore';

interface AnswerExplanationProps {
  result: GrammarSubmitResponse;
}

export const AnswerExplanation = ({ result }: AnswerExplanationProps) => {
  const { colors } = useThemeStore();
  const statusColor = result.isCorrect ? colors.primary : colors.warning;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: statusColor }]}>
      <View style={styles.header}>
        <Ionicons
          name={result.isCorrect ? 'checkmark-circle' : 'alert-circle'}
          size={22}
          color={statusColor}
        />
        <Text style={[styles.title, { color: statusColor }]}>
          {result.isCorrect ? 'Chính xác!' : 'Chưa đúng'}
        </Text>
      </View>

      {!result.isCorrect ? (
        <Text style={[styles.answer, { color: colors.text }]}>
          Đáp án đúng: {result.correctAnswerText}
        </Text>
      ) : null}

      <View style={styles.explainBlock}>
        <Text style={[styles.label, { color: colors.text }]}>Quy tắc</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{result.explanation.rule}</Text>
      </View>

      <View style={styles.explainBlock}>
        <Text style={[styles.label, { color: colors.text }]}>Vì sao đúng?</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>
          {result.explanation.correctReason}
        </Text>
      </View>

      {!result.isCorrect && result.explanation.mistakeReason ? (
        <View style={styles.explainBlock}>
          <Text style={[styles.label, { color: colors.text }]}>Lỗi sai cần nhớ</Text>
          <Text style={[styles.body, { color: colors.textMuted }]}>
            {result.explanation.mistakeReason}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1.5,
    gap: 12,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 17,
  },
  answer: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 15,
    lineHeight: 21,
  },
  explainBlock: {
    gap: 4,
  },
  label: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 13,
  },
  body: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
  },
});
