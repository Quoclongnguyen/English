import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TranscriptSegment, TranscriptWord } from '../../types';
import { Typography } from '../../constants/typography';
import { useThemeStore } from '../../stores/themeStore';

interface TranscriptViewProps {
  transcript: TranscriptSegment[];
  positionMs: number;
  showTranslation: boolean;
  savedWordIds: string[];
  onWordPress: (segmentId: string, word: TranscriptWord) => void;
}

export const TranscriptView = ({
  transcript,
  positionMs,
  showTranslation,
  savedWordIds,
  onWordPress,
}: TranscriptViewProps) => {
  const { colors } = useThemeStore();

  return (
    <View style={styles.container}>
      {transcript.map(segment => {
        const isActive = positionMs >= segment.startMs && positionMs < segment.endMs;
        return (
          <View
            key={segment.id}
            style={[
              styles.segment,
              {
                backgroundColor: isActive ? `${colors.secondary}14` : colors.surface,
                borderColor: isActive ? colors.secondary : colors.border,
              },
            ]}
          >
            <View style={styles.words}>
              {segment.words.map(word => {
                const activeWord = positionMs >= word.startMs && positionMs < word.endMs;
                const saved = savedWordIds.includes(word.id);
                return (
                  <TouchableOpacity
                    key={word.id}
                    disabled={!word.isSaveable}
                    onPress={() => onWordPress(segment.id, word)}
                    style={[
                      styles.word,
                      activeWord && { backgroundColor: colors.xp },
                      saved && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.wordText,
                        { color: activeWord ? '#1A1830' : colors.text },
                      ]}
                    >
                      {word.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {showTranslation && segment.translationVi ? (
              <Text style={[styles.translation, { color: colors.textMuted }]}>
                {segment.translationVi}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 12 },
  segment: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 10 },
  words: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  word: { borderRadius: 6, paddingHorizontal: 3, paddingVertical: 2 },
  wordText: { fontFamily: Typography.fontFamily.semiBold, fontSize: 17, lineHeight: 25 },
  translation: { fontFamily: Typography.fontFamily.regular, fontSize: 14, lineHeight: 21 },
});
