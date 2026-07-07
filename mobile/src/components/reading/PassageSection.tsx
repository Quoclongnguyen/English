import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ReadingSection } from '../../types';
import { Typography } from '../../constants/typography';
import { useThemeStore } from '../../stores/themeStore';

interface PassageSectionProps {
  section: ReadingSection;
  showTranslation: boolean;
  isSelected: boolean;
  onExplain: () => void;
}

export const PassageSection = ({
  section,
  showTranslation,
  isSelected,
  onExplain,
}: PassageSectionProps) => {
  const { colors } = useThemeStore();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      delayLongPress={350}
      onLongPress={onExplain}
      style={[
        styles.card,
        {
          backgroundColor: isSelected ? `${colors.primary}12` : colors.surface,
          borderColor: isSelected ? colors.primary : colors.border,
        },
      ]}
    >
      <Text style={[styles.english, { color: colors.text }]}>{section.english}</Text>
      {showTranslation ? (
        <View style={[styles.translation, { borderTopColor: colors.border }]}>
          <Text style={[styles.vietnamese, { color: colors.textMuted }]}>
            {section.vietnamese}
          </Text>
        </View>
      ) : null}
      <Text style={[styles.hint, { color: colors.primary }]}>NHẤN GIỮ ĐỂ AI GIẢI THÍCH</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 17, gap: 12 },
  english: { fontFamily: Typography.fontFamily.regular, fontSize: 17, lineHeight: 28 },
  translation: { borderTopWidth: 1, paddingTop: 12 },
  vietnamese: { fontFamily: Typography.fontFamily.regular, fontSize: 14, lineHeight: 22 },
  hint: { fontFamily: Typography.fontFamily.mono, fontSize: 9, letterSpacing: 0.5 },
});
