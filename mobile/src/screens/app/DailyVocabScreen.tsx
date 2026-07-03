import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVocabStore } from '../../../src/stores/vocabStore';
import { useThemeStore } from '../../../src/stores/themeStore';
import { Typography } from '../../../src/constants/typography';
import { Button } from '../../../src/components/Button';

const DailyVocabScreen = () => {
  const navigation = useNavigation<any>();
  const { dailyWords, dailyStory, fetchDailyWords, isLoading, error } = useVocabStore();
  const { colors } = useThemeStore();

  useEffect(() => {
    // Only fetch if empty
    if (dailyWords.length === 0) {
      fetchDailyWords();
    }
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>
          Generating your daily words with AI...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Error: {error}</Text>
        <Button title="Try Again" onPress={fetchDailyWords} style={{ marginTop: 20 }} />
      </View>
    );
  }

  if (dailyWords.length === 0) {
    return null;
  }

  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>Today's Vocabulary</Text>
      
      <View style={styles.wordsList}>
        {dailyWords.map((word) => (
          <View key={word._id} style={[styles.wordCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.word, { color: colors.primary }]}>{word.word}</Text>
            <Text style={[styles.phonetic, { color: colors.textMuted }]}>{word.phonetic} • {word.type}</Text>
            <Text style={[styles.meaning, { color: colors.text }]}>{word.meaning_vi}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.storyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.storyTitle, { color: colors.text }]}>Mini-Story</Text>
        <Text style={[styles.storyText, { color: colors.text }]}>{dailyStory}</Text>
      </View>

      <Button
        title="Start Flashcards"
        onPress={() => navigation.navigate('FlashcardScreen', { words: dailyWords })}
        style={styles.actionBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontFamily: Typography.fontFamily.regular,
  },
  screen: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 28,
  },
  wordsList: {
    gap: 12,
  },
  wordCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
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
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
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
    marginTop: 12,
    marginBottom: 40,
  },
});

export default DailyVocabScreen;
