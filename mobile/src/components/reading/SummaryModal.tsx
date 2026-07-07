import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ReadingSummary } from '../../types';
import { Typography } from '../../constants/typography';
import { useThemeStore } from '../../stores/themeStore';

interface SummaryModalProps {
  visible: boolean;
  loading: boolean;
  summary: ReadingSummary | null;
  onClose: () => void;
}

export const SummaryModal = ({
  visible,
  loading,
  summary,
  onClose,
}: SummaryModalProps) => {
  const { colors } = useThemeStore();
  const [language, setLanguage] = useState<'EN' | 'VI'>('EN');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={event => event.stopPropagation()}
        >
          <View style={styles.header}>
            <View>
              <Text style={[styles.eyebrow, { color: colors.primary }]}>GEMINI SUMMARY</Text>
              <Text style={[styles.title, { color: colors.text }]}>Tóm tắt bài đọc</Text>
            </View>
            <Pressable
              onPress={() => setLanguage(value => (value === 'EN' ? 'VI' : 'EN'))}
              style={[styles.toggle, { borderColor: colors.primary }]}
            >
              <Text style={[styles.toggleText, { color: colors.primary }]}>{language}</Text>
            </Pressable>
          </View>
          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.body, { color: colors.textMuted }]}>Đang chuẩn bị tóm tắt...</Text>
            </View>
          ) : (
            <Text style={[styles.body, { color: colors.text }]}>
              {language === 'EN' ? summary?.english : summary?.vietnamese}
            </Text>
          )}
          <Pressable onPress={onClose} style={[styles.done, { backgroundColor: colors.primary }]}>
            <Text style={styles.doneText}>Đã hiểu</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'rgba(0,0,0,0.6)' },
  card: { width: '100%', borderRadius: 24, borderWidth: 1, padding: 22, gap: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { fontFamily: Typography.fontFamily.mono, fontSize: 9, letterSpacing: 0.7 },
  title: { fontFamily: Typography.fontFamily.bold, fontSize: 22 },
  toggle: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 11, paddingVertical: 7 },
  toggleText: { fontFamily: Typography.fontFamily.bold, fontSize: 11 },
  loading: { minHeight: 120, alignItems: 'center', justifyContent: 'center', gap: 10 },
  body: { fontFamily: Typography.fontFamily.regular, fontSize: 16, lineHeight: 25 },
  done: { borderRadius: 16, alignItems: 'center', paddingVertical: 14 },
  doneText: { color: '#082014', fontFamily: Typography.fontFamily.bold, fontSize: 15 },
});
