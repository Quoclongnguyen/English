import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ReadingExplanation } from '../../types';
import { Typography } from '../../constants/typography';
import { useThemeStore } from '../../stores/themeStore';

interface ExplainModalProps {
  visible: boolean;
  loading: boolean;
  explanation: ReadingExplanation | null;
  onClose: () => void;
}

export const ExplainModal = ({
  visible,
  loading,
  explanation,
  onClose,
}: ExplainModalProps) => {
  const { colors } = useThemeStore();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={event => event.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>AI giải thích</Text>
            <Pressable onPress={onClose}>
              <Text style={[styles.close, { color: colors.textMuted }]}>Đóng</Text>
            </Pressable>
          </View>
          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.body, { color: colors.textMuted }]}>Gemini đang phân tích...</Text>
            </View>
          ) : explanation ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.label, { color: colors.primary }]}>GIẢI THÍCH</Text>
              <Text style={[styles.body, { color: colors.text }]}>{explanation.explanationVi}</Text>

              <Text style={[styles.label, { color: colors.primary }]}>ENGLISH ĐƠN GIẢN</Text>
              <Text style={[styles.body, { color: colors.text }]}>{explanation.simplifiedEnglish}</Text>

              {explanation.difficultWords.length ? (
                <>
                  <Text style={[styles.label, { color: colors.primary }]}>TỪ KHÓ</Text>
                  {explanation.difficultWords.map(item => (
                    <View key={item.word} style={styles.row}>
                      <Text style={[styles.term, { color: colors.text }]}>{item.word}</Text>
                      <Text style={[styles.definition, { color: colors.textMuted }]}>{item.meaningVi}</Text>
                    </View>
                  ))}
                </>
              ) : null}

              {explanation.grammarNotes.length ? (
                <>
                  <Text style={[styles.label, { color: colors.primary }]}>NGỮ PHÁP</Text>
                  {explanation.grammarNotes.map(note => (
                    <Text key={note} style={[styles.body, { color: colors.text }]}>• {note}</Text>
                  ))}
                </>
              ) : null}
            </ScrollView>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: { maxHeight: '82%', minHeight: 300, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, padding: 24, gap: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: Typography.fontFamily.bold, fontSize: 23 },
  close: { fontFamily: Typography.fontFamily.semiBold, fontSize: 14 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  label: { fontFamily: Typography.fontFamily.mono, fontSize: 10, letterSpacing: 0.7, marginTop: 18, marginBottom: 7 },
  body: { fontFamily: Typography.fontFamily.regular, fontSize: 15, lineHeight: 23 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 7 },
  term: { width: 100, fontFamily: Typography.fontFamily.bold, fontSize: 14 },
  definition: { flex: 1, fontFamily: Typography.fontFamily.regular, fontSize: 14 },
});
