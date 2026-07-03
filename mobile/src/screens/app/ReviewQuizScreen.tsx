import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore } from '../../../src/stores/themeStore';
import { Typography } from '../../../src/constants/typography';
import { useVocabStore } from '../../../src/stores/vocabStore';
import { Button } from '../../../src/components/Button';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const ReviewQuizScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useThemeStore();
  const { reviewQueue, fetchReviewQueue, updateWordProgress, isLoading } = useVocabStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchReviewQueue();
  }, []);

  const currentItem = reviewQueue[currentIndex];

  useEffect(() => {
    if (currentItem) {
      // Simple Multiple Choice: 1 correct meaning, 3 random incorrect ones
      // In a real app, fetch random meanings from VocabBank
      const fakeMeanings = ['quản lý', 'người phát triển', 'thiết kế', 'tài liệu', 'cơ sở dữ liệu'];
      const currentMeaning = (currentItem.wordId as any).meaning_vi;
      
      let pool = fakeMeanings.filter(m => m !== currentMeaning);
      pool = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
      pool.push(currentMeaning);
      pool = pool.sort(() => 0.5 - Math.random()); // shuffle
      
      setOptions(pool);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, [currentIndex, currentItem]);

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = options[index] === (currentItem.wordId as any).meaning_vi;
    const quality = isCorrect ? 4 : 2; // Good or Incorrect
    updateWordProgress(currentItem.wordId as any, quality);
  };

  const handleNext = () => {
    if (currentIndex < reviewQueue.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.goBack();
    }
  };

  const playAudio = () => {
    if (currentItem) {
      Speech.speak((currentItem.wordId as any).word, { language: 'en-US' });
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading review queue...</Text>
      </View>
    );
  }

  if (reviewQueue.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text, textAlign: 'center' }]}>You're all caught up!</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted, textAlign: 'center', marginTop: 12 }]}>
          No words to review right now.
        </Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} style={{ marginTop: 24 }} />
      </View>
    );
  }

  if (!currentItem) return null;

  const currentWord = currentItem.wordId as any;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="close" size={28} color={colors.text} />
        </Pressable>
        <Text style={[styles.progress, { color: colors.textMuted }]}>
          {currentIndex + 1} / {reviewQueue.length}
        </Text>
        <View style={styles.iconBtn} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.questionType, { color: colors.primary }]}>Choose the correct meaning</Text>
        
        <View style={styles.wordContainer}>
          <Text style={[styles.word, { color: colors.text }]}>{currentWord.word}</Text>
          <Pressable onPress={playAudio} style={styles.audioBtn}>
            <Ionicons name="volume-high" size={24} color={'#3B82F6'} />
          </Pressable>
        </View>
        <Text style={[styles.phonetic, { color: colors.textMuted }]}>{currentWord.phonetic}</Text>

        <View style={styles.options}>
          {options.map((opt, idx) => {
            let bgColor = colors.surface;
            let borderColor = colors.border;
            let textColor = colors.text;

            if (isAnswered) {
              if (opt === currentWord.meaning_vi) {
                bgColor = 'rgba(0, 214, 143, 0.12)';
                borderColor = '#00D68F'; // Correct
              } else if (idx === selectedOption) {
                bgColor = 'rgba(255, 107, 53, 0.12)';
                borderColor = '#FF6B35'; // Wrong
              }
            }

            return (
              <Pressable
                key={idx}
                onPress={() => handleSelect(idx)}
                style={[
                  styles.optionCard,
                  { backgroundColor: bgColor, borderColor },
                  !isAnswered && idx === selectedOption && { borderColor: colors.primary }
                ]}
              >
                <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>

        {isAnswered && (
          <View style={[styles.explanation, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.explTitle, { color: colors.text }]}>
              {options[selectedOption!] === currentWord.meaning_vi ? 'Correct!' : 'Incorrect'}
            </Text>
            <Text style={[styles.explText, { color: colors.text }]}>
              {currentWord.word} means "{currentWord.meaning_vi}".
            </Text>
            <Text style={[styles.explExample, { color: colors.textMuted }]}>
              Ex: {currentWord.example}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Button
          title={currentIndex < reviewQueue.length - 1 ? "Next" : "Finish"}
          onPress={handleNext}
          disabled={!isAnswered}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  screen: {
    flex: 1,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 24,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  questionType: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 24,
  },
  wordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  word: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 40,
  },
  audioBtn: {
    padding: 8,
    backgroundColor: 'rgba(59,130,246, 0.12)',
    borderRadius: 12,
  },
  phonetic: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 16,
    marginTop: 4,
    marginBottom: 40,
  },
  options: {
    gap: 12,
  },
  optionCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
  },
  optionText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 18,
  },
  explanation: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  explTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 18,
  },
  explText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 16,
  },
  explExample: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
    fontStyle: 'italic',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
});

export default ReviewQuizScreen;
