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
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { AudioPlayer } from '../../components/listening/AudioPlayer';
import { TranscriptView } from '../../components/listening/TranscriptView';
import { WordMeaningModal } from '../../components/listening/WordMeaningModal';
import { SAMPLE_LISTENING_LESSON_ID } from '../../constants/config';
import { Typography } from '../../constants/typography';
import { useListeningStore } from '../../stores/listeningStore';
import { useThemeStore } from '../../stores/themeStore';
import { TranscriptWord } from '../../types';
import { resolveImageUrl } from '../../utils/imageUrl';

const RATES = [0.75, 1, 1.25, 1.5];

const ListeningContent = () => {
  const navigation = useNavigation();
  const { colors } = useThemeStore();
  const { lesson, savedWordIds, isSavingWord, saveWord } = useListeningStore();
  const [showTranslation, setShowTranslation] = useState(false);
  const [rateIndex, setRateIndex] = useState(1);
  const [selection, setSelection] = useState<{
    segmentId: string;
    word: TranscriptWord;
  } | null>(null);
  const player = useAudioPlayer(
    lesson?.audioUrl ? resolveImageUrl(lesson.audioUrl) : null,
    { updateInterval: 150 },
  );
  const status = useAudioPlayerStatus(player);
  const rate = RATES[rateIndex];

  const selectedSaved = useMemo(
    () => (selection ? savedWordIds.includes(selection.word.id) : false),
    [savedWordIds, selection],
  );

  const cycleRate = () => {
    const nextIndex = (rateIndex + 1) % RATES.length;
    setRateIndex(nextIndex);
    player.setPlaybackRate(RATES[nextIndex]);
  };

  const handleSave = async () => {
    if (!selection) return;
    try {
      const alreadySaved = await saveWord(selection.segmentId, selection.word.id);
      Alert.alert(
        alreadySaved ? 'Từ đã có trong Vocab Bank' : 'Đã lưu từ',
        alreadySaved ? 'Tiến trình ôn tập hiện tại được giữ nguyên.' : 'Từ đã được thêm vào hàng đợi SM-2.',
      );
    } catch (error) {
      Alert.alert('Không thể lưu từ', error instanceof Error ? error.message : 'Vui lòng thử lại.');
    }
  };

  if (!lesson) return null;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={27} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCopy}>
          <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>{lesson.title}</Text>
          <Text style={[styles.meta, { color: colors.secondary }]}>{lesson.level} · {lesson.topic}</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowTranslation(value => !value)}
          style={[styles.toggle, { borderColor: colors.secondary }]}
        >
          <Text style={[styles.toggleText, { color: colors.secondary }]}>
            {showTranslation ? 'VI' : 'EN'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AudioPlayer player={player} status={status} rate={rate} onRateChange={cycleRate} />
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Transcript</Text>
          <Text style={[styles.hint, { color: colors.textMuted }]}>Chạm từ được tô để xem nghĩa</Text>
        </View>
        <TranscriptView
          transcript={lesson.transcript}
          positionMs={status.currentTime * 1000}
          showTranslation={showTranslation}
          savedWordIds={savedWordIds}
          onWordPress={(segmentId, word) => setSelection({ segmentId, word })}
        />
      </ScrollView>

      <WordMeaningModal
        word={selection?.word ?? null}
        visible={Boolean(selection)}
        isSaving={isSavingWord}
        isSaved={selectedSaved}
        onClose={() => setSelection(null)}
        onSave={handleSave}
      />
    </View>
  );
};

const ListeningPlayerScreen = () => {
  const { colors } = useThemeStore();
  const { lesson, isLoading, error, loadLesson, clear } = useListeningStore();

  useEffect(() => {
    loadLesson(SAMPLE_LISTENING_LESSON_ID).catch(() => undefined);
    return clear;
  }, [clear, loadLesson]);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>Đang tải bài nghe...</Text>
      </View>
    );
  }

  if (error || !lesson) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorTitle, { color: colors.text }]}>Không mở được bài nghe</Text>
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>{error}</Text>
        <TouchableOpacity onPress={() => loadLesson(SAMPLE_LISTENING_LESSON_ID)}>
          <Text style={[styles.retry, { color: colors.secondary }]}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <ListeningContent />;
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 18, paddingTop: 52, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  headerCopy: { flex: 1 },
  title: { fontFamily: Typography.fontFamily.bold, fontSize: 19 },
  meta: { fontFamily: Typography.fontFamily.mono, fontSize: 10, textTransform: 'uppercase' },
  toggle: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 7 },
  toggleText: { fontFamily: Typography.fontFamily.bold, fontSize: 11 },
  content: { padding: 18, paddingBottom: 40, gap: 18 },
  sectionHeader: { gap: 3 },
  sectionTitle: { fontFamily: Typography.fontFamily.bold, fontSize: 21 },
  hint: { fontFamily: Typography.fontFamily.regular, fontSize: 13 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30, gap: 12 },
  loadingText: { fontFamily: Typography.fontFamily.regular, fontSize: 14, textAlign: 'center' },
  errorTitle: { fontFamily: Typography.fontFamily.bold, fontSize: 21 },
  retry: { fontFamily: Typography.fontFamily.bold, fontSize: 15, marginTop: 8 },
});

export default ListeningPlayerScreen;
