import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GrammarTopic } from '../../types';
import { Typography } from '../../constants/typography';
import { useThemeStore } from '../../stores/themeStore';

interface TheorySectionProps {
  topic: GrammarTopic;
}

const labelMap: Record<string, string> = {
  affirmative: 'Khẳng định',
  negative: 'Phủ định',
  question: 'Câu hỏi',
  other: 'Khác',
};

export const TheorySection = ({ topic }: TheorySectionProps) => {
  const { colors } = useThemeStore();

  return (
    <View style={styles.wrap}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tổng quan</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{topic.theory.overview}</Text>
      </View>

      <View style={styles.block}>
        <Text style={[styles.groupTitle, { color: colors.text }]}>Khi nào dùng?</Text>
        {topic.theory.usages.map(usage => (
          <View
            key={usage.id}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.itemTitle, { color: colors.accent }]}>{usage.title}</Text>
            <Text style={[styles.body, { color: colors.textMuted }]}>{usage.explanation}</Text>
            {usage.examples.map(example => (
              <View key={example.english} style={styles.example}>
                <Text style={[styles.exampleEnglish, { color: colors.text }]}>{example.english}</Text>
                <Text style={[styles.exampleVi, { color: colors.textMuted }]}>{example.vietnamese}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.block}>
        <Text style={[styles.groupTitle, { color: colors.text }]}>Cấu trúc</Text>
        {topic.theory.structures.map(structure => (
          <View
            key={structure.id}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.itemTitle, { color: colors.warning }]}>
              {labelMap[structure.label] ?? labelMap.other}
            </Text>
            <Text style={[styles.formula, { color: colors.text }]}>{structure.formula}</Text>
            {structure.explanation ? (
              <Text style={[styles.body, { color: colors.textMuted }]}>{structure.explanation}</Text>
            ) : null}
            {structure.examples.map(example => (
              <View key={example.english} style={styles.example}>
                <Text style={[styles.exampleEnglish, { color: colors.text }]}>{example.english}</Text>
                <Text style={[styles.exampleVi, { color: colors.textMuted }]}>{example.vietnamese}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {topic.theory.notes.length > 0 ? (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ghi nhớ nhanh</Text>
          {topic.theory.notes.map(note => (
            <Text key={note} style={[styles.note, { color: colors.textMuted }]}>
              • {note}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: 14,
  },
  block: {
    gap: 10,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 18,
  },
  groupTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 20,
  },
  itemTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 15,
  },
  body: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 22,
  },
  formula: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 14,
    lineHeight: 20,
  },
  example: {
    gap: 3,
  },
  exampleEnglish: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 14,
    lineHeight: 20,
  },
  exampleVi: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  note: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 22,
  },
});
