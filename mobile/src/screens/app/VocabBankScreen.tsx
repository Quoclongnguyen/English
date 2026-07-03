import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useVocabStore } from '../../../src/stores/vocabStore';
import { useThemeStore } from '../../../src/stores/themeStore';
import { Typography } from '../../../src/constants/typography';
import { Badge } from '../../../src/components/Badge';

const VocabBankScreen = () => {
  const { vocabBank, fetchVocabBank, isLoading } = useVocabStore();
  const { colors } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchVocabBank();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVocabBank();
    setRefreshing(false);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Vocab Bank</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          {vocabBank.length} words learned
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing || isLoading} onRefresh={onRefresh} />
        }
      >
        {vocabBank.length === 0 && !isLoading && (
          <Text style={[styles.empty, { color: colors.textMuted }]}>
            No words yet. Go to Daily Vocab to learn some!
          </Text>
        )}

        {vocabBank.map((word) => (
          <View key={word._id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.word, { color: colors.text }]}>{word.word}</Text>
              <Badge
                label={word.progress?.status === 'mastered' ? 'Mastered' : 'Learning'}
                color={word.progress?.status === 'mastered' ? 'green' : 'yellow'}
              />
            </View>
            <Text style={[styles.phonetic, { color: colors.textMuted }]}>{word.phonetic}</Text>
            <Text style={[styles.meaning, { color: colors.text }]}>{word.meaning_vi}</Text>
            <Text style={[styles.example, { color: colors.textMuted }]}>{word.example}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    padding: 24,
    paddingTop: 48,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 28,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
    marginTop: 4,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontFamily: Typography.fontFamily.regular,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  word: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 20,
  },
  phonetic: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 12,
  },
  meaning: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 16,
    marginTop: 4,
  },
  example: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default VocabBankScreen;
