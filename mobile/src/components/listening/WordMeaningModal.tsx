import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { TranscriptWord } from '../../types';
import { Button } from '../Button';
import { Typography } from '../../constants/typography';
import { useThemeStore } from '../../stores/themeStore';

interface WordMeaningModalProps {
  word: TranscriptWord | null;
  visible: boolean;
  isSaving: boolean;
  isSaved: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const WordMeaningModal = ({
  word,
  visible,
  isSaving,
  isSaved,
  onClose,
  onSave,
}: WordMeaningModalProps) => {
  const { colors } = useThemeStore();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={event => event.stopPropagation()}
        >
          <View style={styles.heading}>
            <Text style={[styles.word, { color: colors.text }]}>{word?.normalizedText}</Text>
            {word?.phonetic ? (
              <Text style={[styles.phonetic, { color: colors.secondary }]}>{word.phonetic}</Text>
            ) : null}
          </View>
          <Text style={[styles.type, { color: colors.textMuted }]}>{word?.type}</Text>
          <Text style={[styles.meaning, { color: colors.text }]}>{word?.meaningVi}</Text>
          {word?.example ? (
            <Text style={[styles.example, { color: colors.textMuted }]}>{word.example}</Text>
          ) : null}
          <Button
            title={isSaved ? 'Đã lưu vào Vocab Bank' : 'Lưu từ'}
            onPress={onSave}
            color="blue"
            loading={isSaving}
            disabled={isSaved}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, padding: 24, paddingBottom: 36, gap: 12 },
  heading: { flexDirection: 'row', alignItems: 'baseline', gap: 12 },
  word: { fontFamily: Typography.fontFamily.bold, fontSize: 28 },
  phonetic: { fontFamily: Typography.fontFamily.mono, fontSize: 13 },
  type: { fontFamily: Typography.fontFamily.mono, fontSize: 11, textTransform: 'uppercase' },
  meaning: { fontFamily: Typography.fontFamily.semiBold, fontSize: 18 },
  example: { fontFamily: Typography.fontFamily.regular, fontSize: 14, lineHeight: 21, marginBottom: 8 },
});
