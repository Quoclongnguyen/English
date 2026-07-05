import React, { useEffect, useState } from 'react';
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
import { ExplainModal } from '../../components/reading/ExplainModal';
import { PassageSection } from '../../components/reading/PassageSection';
import { SummaryModal } from '../../components/reading/SummaryModal';
import { SAMPLE_READING_PASSAGE_ID } from '../../constants/config';
import { Typography } from '../../constants/typography';
import { useReadingStore } from '../../stores/readingStore';
import { useThemeStore } from '../../stores/themeStore';

const ReadingContent = () => {
  const navigation = useNavigation();
  const { colors } = useThemeStore();
  const {
    passage,
    explanation,
    summary,
    selectedSectionId,
    isExplaining,
    isLoadingSummary,
    explainSection,
    loadSummary,
    clearExplanation,
  } = useReadingStore();
  const [showTranslation, setShowTranslation] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);

  if (!passage) return null;

  const openExplanation = async (sectionId: string) => {
    try {
      await explainSection(sectionId);
    } catch (error) {
      Alert.alert(
        'Không thể giải thích',
        error instanceof Error ? error.message : 'Vui lòng thử lại.',
      );
      clearExplanation();
    }
  };

  const openSummary = async () => {
    setSummaryVisible(true);
    try {
      await loadSummary();
    } catch (error) {
      setSummaryVisible(false);
      Alert.alert(
        'Không thể tạo tóm tắt',
        error instanceof Error ? error.message : 'Vui lòng thử lại.',
      );
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={27} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Reading</Text>
        <TouchableOpacity
          onPress={() => setShowTranslation(value => !value)}
          style={[styles.toggle, { borderColor: colors.primary }]}
        >
          <Text style={[styles.toggleText, { color: colors.primary }]}>
            {showTranslation ? 'VI' : 'EN'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.tags}>
            <Text style={[styles.tag, { color: colors.primary }]}>{passage.level}</Text>
            <Text style={[styles.tag, { color: colors.textMuted }]}>{passage.topic}</Text>
            <Text style={[styles.tag, { color: colors.textMuted }]}>
              {passage.estimatedReadingMinutes} phút
            </Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{passage.title}</Text>
          {passage.description ? (
            <Text style={[styles.description, { color: colors.textMuted }]}>
              {passage.description}
            </Text>
          ) : null}
        </View>

        {passage.sections.map(section => (
          <PassageSection
            key={section.id}
            section={section}
            showTranslation={showTranslation}
            isSelected={selectedSectionId === section.id}
            onExplain={() => openExplanation(section.id)}
          />
        ))}

        <TouchableOpacity
          onPress={openSummary}
          style={[styles.summaryButton, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="sparkles" size={20} color="#082014" />
          <Text style={styles.summaryText}>Xem tóm tắt AI</Text>
        </TouchableOpacity>
      </ScrollView>

      <ExplainModal
        visible={Boolean(selectedSectionId)}
        loading={isExplaining}
        explanation={explanation}
        onClose={clearExplanation}
      />
      <SummaryModal
        visible={summaryVisible}
        loading={isLoadingSummary}
        summary={summary}
        onClose={() => setSummaryVisible(false)}
      />
    </View>
  );
};

const ReadingScreen = () => {
  const { colors } = useThemeStore();
  const { passage, isLoading, error, loadPassage, clear } = useReadingStore();

  useEffect(() => {
    loadPassage(SAMPLE_READING_PASSAGE_ID).catch(() => undefined);
    return clear;
  }, [clear, loadPassage]);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.status, { color: colors.textMuted }]}>Đang tải bài đọc...</Text>
      </View>
    );
  }

  if (error || !passage) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorTitle, { color: colors.text }]}>Không mở được bài đọc</Text>
        <Text style={[styles.status, { color: colors.textMuted }]}>{error}</Text>
        <TouchableOpacity onPress={() => loadPassage(SAMPLE_READING_PASSAGE_ID)}>
          <Text style={[styles.retry, { color: colors.primary }]}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <ReadingContent />;
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 18, paddingTop: 52, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontFamily: Typography.fontFamily.bold, fontSize: 20 },
  toggle: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 7 },
  toggleText: { fontFamily: Typography.fontFamily.bold, fontSize: 11 },
  content: { padding: 18, paddingBottom: 42, gap: 14 },
  hero: { gap: 8, marginBottom: 4 },
  tags: { flexDirection: 'row', gap: 12 },
  tag: { fontFamily: Typography.fontFamily.mono, fontSize: 10, textTransform: 'uppercase' },
  title: { fontFamily: Typography.fontFamily.bold, fontSize: 30, lineHeight: 36 },
  description: { fontFamily: Typography.fontFamily.regular, fontSize: 15, lineHeight: 22 },
  summaryButton: { marginTop: 8, borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  summaryText: { color: '#082014', fontFamily: Typography.fontFamily.bold, fontSize: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30, gap: 12 },
  status: { fontFamily: Typography.fontFamily.regular, fontSize: 14, textAlign: 'center' },
  errorTitle: { fontFamily: Typography.fontFamily.bold, fontSize: 21 },
  retry: { fontFamily: Typography.fontFamily.bold, fontSize: 15, marginTop: 8 },
});

export default ReadingScreen;
