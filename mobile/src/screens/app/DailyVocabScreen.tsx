import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../src/stores/authStore';
import { useVocabStore } from '../../../src/stores/vocabStore';
import { useThemeStore } from '../../../src/stores/themeStore';
import { Typography } from '../../../src/constants/typography';
import { Button } from '../../../src/components/Button';
import { Badge } from '../../../src/components/Badge';

const DailyVocabScreen = () => {
  const navigation = useNavigation<any>();
  const {
    dailyWords,
    dailyStory,
    fetchDailyWords,
    isDailySessionCompleted,
    isLoading,
    error,
  } = useVocabStore();
  const { user } = useAuthStore();
  const { colors } = useThemeStore();
  const dailyTarget = user?.dailyTarget ?? 7;
  const progressText = `${dailyWords.length}/${dailyTarget} words ready`;

  useEffect(() => {
    if (dailyWords.length === 0) {
      fetchDailyWords();
    }
  }, [dailyWords.length, fetchDailyWords]);

  const goHome = () => navigation.navigate('Tabs', { screen: 'Home' });
  const openVocabBank = () => navigation.navigate('Tabs', { screen: 'VocabBank' });

  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={goHome} style={styles.backButton} activeOpacity={0.8}>
        <Ionicons name="chevron-back" size={26} color={colors.text} />
      </TouchableOpacity>
      <View style={styles.headerText}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>VOCABULARY</Text>
        <Text style={[styles.title, { color: colors.text }]}>Today's Vocabulary</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={goHome} style={styles.floatingBack}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>
          AI đang chọn từ dựa trên level, mục tiêu học và các từ bạn đã học trước đó...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={goHome} style={styles.floatingBack}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.errorTitle, { color: colors.text }]}>Không tải được từ hôm nay</Text>
        <Text style={[styles.errorText, { color: colors.textMuted }]}>{error}</Text>
        <Button title="Thử lại" onPress={fetchDailyWords} style={styles.centerButton} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Header />

      <View style={[styles.contextCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.contextHeader}>
          <Ionicons name="sparkles" size={19} color={colors.primary} />
          <Text style={[styles.contextTitle, { color: colors.text }]}>How this lesson is built</Text>
        </View>
        <Text style={[styles.contextText, { color: colors.textMuted }]}>
          AI chọn từ dựa trên level {user?.level ?? 'A1'}, mục tiêu {user?.goal ?? 'daily'},
          daily target {dailyTarget} từ và danh sách từ bạn đã học.
        </Text>
        <View style={styles.badges}>
          <Badge label={user?.level ?? 'A1'} color="purple" />
          <Badge label={user?.goal ?? 'daily'} color="green" />
          <Badge label={progressText} color="blue" />
        </View>
      </View>

      {dailyWords.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="book-outline" size={36} color={colors.primary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Chưa có từ hôm nay</Text>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Bấm nút bên dưới để AI tạo danh sách từ phù hợp với lộ trình hiện tại của bạn.
          </Text>
          <Button title="Generate Daily Words" onPress={fetchDailyWords} color="green" />
          <Button title="Về Home" onPress={goHome} variant="ghost" color="dark" />
        </View>
      ) : (
        <>
          {isDailySessionCompleted ? (
            <View style={[styles.completeCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
              <Ionicons name="checkmark-circle" size={32} color={colors.primary} />
              <View style={styles.completeText}>
                <Text style={[styles.completeTitle, { color: colors.text }]}>Daily vocab completed</Text>
                <Text style={[styles.completeBody, { color: colors.textMuted }]}>
                  Bạn đã luyện xong {dailyWords.length} từ hôm nay. Có thể xem lại trong Vocab Bank
                  hoặc quay về Home để học module tiếp theo.
                </Text>
              </View>
            </View>
          ) : null}

          <View style={[styles.progressCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressTitle, { color: colors.text }]}>Today's progress</Text>
              <Text style={[styles.progressValue, { color: colors.primary }]}>{progressText}</Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${Math.min(100, (dailyWords.length / dailyTarget) * 100)}%`,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.wordsList}>
            {dailyWords.map(word => (
              <View
                key={word._id}
                style={[styles.wordCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Text style={[styles.word, { color: colors.primary }]}>{word.word}</Text>
                <Text style={[styles.phonetic, { color: colors.textMuted }]}>
                  {word.phonetic} · {word.type}
                </Text>
                <Text style={[styles.meaning, { color: colors.text }]}>{word.meaning_vi}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.storyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.storyTitle, { color: colors.text }]}>Mini-Story</Text>
            <Text style={[styles.storyText, { color: colors.text }]}>{dailyStory}</Text>
          </View>

          <Button
            title={isDailySessionCompleted ? 'Practice Again' : 'Start Flashcards'}
            onPress={() =>
              navigation.navigate('FlashcardScreen', {
                words: dailyWords,
                isDailyVocabSession: true,
              })
            }
            style={styles.actionBtn}
          />
          <Button
            title="Open Vocab Bank"
            onPress={openVocabBank}
            variant="outline"
            color="green"
          />
          {isDailySessionCompleted ? (
            <Button title="Back Home" onPress={goHome} variant="ghost" color="dark" />
          ) : null}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  floatingBack: {
    height: 40,
    justifyContent: 'center',
    left: 18,
    position: 'absolute',
    top: 52,
    width: 40,
  },
  loadingText: {
    fontFamily: Typography.fontFamily.regular,
    lineHeight: 22,
    marginTop: 16,
    textAlign: 'center',
  },
  errorTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 20,
  },
  errorText: {
    fontFamily: Typography.fontFamily.regular,
    lineHeight: 21,
    marginTop: 8,
    textAlign: 'center',
  },
  centerButton: {
    marginTop: 20,
  },
  screen: {
    flex: 1,
  },
  content: {
    gap: 18,
    padding: 24,
    paddingBottom: 44,
    paddingTop: 52,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  backButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    marginLeft: -10,
    width: 40,
  },
  headerText: {
    flex: 1,
    gap: 3,
  },
  eyebrow: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 28,
  },
  contextCard: {
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  contextHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  contextTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 16,
  },
  contextText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emptyCard: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    padding: 20,
  },
  emptyTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 20,
  },
  emptyText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  completeCard: {
    alignItems: 'flex-start',
    borderRadius: 18,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  completeText: {
    flex: 1,
    gap: 4,
  },
  completeTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 18,
  },
  completeBody: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  progressCard: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
    padding: 14,
  },
  progressHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 15,
  },
  progressValue: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 12,
  },
  progressTrack: {
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 999,
    height: 8,
  },
  wordsList: {
    gap: 12,
  },
  wordCard: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
    padding: 16,
  },
  word: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 20,
  },
  phonetic: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 14,
  },
  meaning: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 16,
    marginTop: 4,
  },
  storyCard: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    padding: 20,
  },
  storyTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 18,
  },
  storyText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  actionBtn: {
    marginTop: 8,
  },
});

export default DailyVocabScreen;
