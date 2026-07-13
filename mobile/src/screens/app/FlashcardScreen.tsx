import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Animated } from 'react-native';
import * as Speech from 'expo-speech';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useThemeStore } from '../../../src/stores/themeStore';
import { Typography } from '../../../src/constants/typography';
import { Word } from '../../../src/types';
import { Button } from '../../../src/components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useVocabStore } from '../../../src/stores/vocabStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

const FlashcardScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useThemeStore();
  const { updateWordProgress, markDailySessionCompleted } = useVocabStore();

  const words: Word[] = route.params?.words || [];
  const isReviewMode = route.params?.isReviewMode || false;
  const isDailyVocabSession = route.params?.isDailyVocabSession || false;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // React Native built-in Animated — works 100% on Expo Go
  const flipAnim = useRef(new Animated.Value(0)).current; // 0 = front, 1 = back

  const currentWord = words[currentIndex];

  const playAudio = () => {
    if (currentWord) {
      Speech.speak(currentWord.word, { language: 'en-US', rate: 0.9 });
    }
  };

  const handleFlip = () => {
    const toValue = isFlipped ? 0 : 180;




    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
    if (!isFlipped) playAudio();
    setIsFlipped(!isFlipped);
  };

  const handleNext = async (quality: number) => {
    if (isReviewMode && currentWord) {
      await updateWordProgress(currentWord._id, quality);
    }
    if (currentIndex < words.length - 1) {
      // Reset flip instantly before going to next card
      flipAnim.setValue(0);
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (isDailyVocabSession) {
        markDailySessionCompleted();
      }
      navigation.goBack();
    }
  };

  // ── Split flip: front rotates 0→90° (disappears), back rotates -90°→0° (appears)
  // This way both faces are NEVER visible at the same time — no glitch at 90°

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '90deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.48, 0.5],
    outputRange: [1, 1, 0],
  });

  const backRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-90deg', '-90deg', '0deg'],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0.5, 0.52, 1],
    outputRange: [0, 1, 1],
  });

  if (!currentWord) return null;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close" size={28} color={colors.text} />
        </Pressable>
        <Text style={[styles.progress, { color: colors.textMuted }]}>
          {currentIndex + 1} / {words.length}
        </Text>
        <View style={styles.closeBtn} />
      </View>

      <View style={styles.cardContainer}>
        {/* FRONT */}
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
            { position: 'absolute' },
            { opacity: frontOpacity },
            { transform: [{ perspective: 1000 }, { rotateY: frontRotate }] },
          ]}
        >
          <Pressable style={styles.cardPressable} onPress={handleFlip}>
            <Text style={[styles.frontWord, { color: colors.primary }]}>{currentWord.word}</Text>
            <Text style={[styles.hint, { color: colors.textMuted }]}>Tap to flip</Text>
          </Pressable>
        </Animated.View>

        {/* BACK */}
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
            { opacity: backOpacity },
            { transform: [{ perspective: 1000 }, { rotateY: backRotate }] },
          ]}
        >
          <Pressable style={styles.cardPressable} onPress={handleFlip}>
            <View style={styles.backContent}>
              <View style={styles.wordHeader}>
                <Text style={[styles.backWord, { color: colors.primary }]}>{currentWord.word}</Text>
                <Pressable onPress={playAudio} style={styles.audioBtn}>
                  <Ionicons name="volume-high" size={24} color={'#3B82F6'} />
                </Pressable>
              </View>
              <Text style={[styles.phonetic, { color: colors.textMuted }]}>
                {currentWord.phonetic} • {currentWord.type}
              </Text>

              <View style={styles.divider} />

              <Text style={[styles.meaning, { color: colors.text }]}>{currentWord.meaning_vi}</Text>
              <Text style={[styles.example, { color: colors.textMuted }]}>{currentWord.example}</Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        {isReviewMode ? (
          <View style={styles.reviewButtons}>
            <Button title="Again" variant="outline" color="orange" onPress={() => handleNext(0)} style={styles.flex1} />
            <Button title="Hard" variant="outline" color="blue" onPress={() => handleNext(3)} style={styles.flex1} />
            <Button title="Good" variant="primary" color="green" onPress={() => handleNext(4)} style={styles.flex1} />
            <Button title="Easy" variant="primary" color="purple" onPress={() => handleNext(5)} style={styles.flex1} />
          </View>
        ) : (
          <Button
            title={currentIndex < words.length - 1 ? 'Next Word' : 'Finish'}
            onPress={() => handleNext(4)}
            disabled={!isFlipped}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  closeBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 16,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  cardPressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  frontWord: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 48,
    textAlign: 'center',
  },
  hint: {
    position: 'absolute',
    bottom: 30,
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
  },
  backContent: {
    width: '100%',
    gap: 12,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backWord: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 32,
  },
  audioBtn: {
    padding: 8,
    backgroundColor: 'rgba(59,130,246, 0.12)',
    borderRadius: 12,
  },
  phonetic: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(150,150,150,0.2)',
    marginVertical: 8,
  },
  meaning: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 22,
  },
  example: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 18,
    fontStyle: 'italic',
    marginTop: 8,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  reviewButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  flex1: {
    flex: 1,
  },
});

export default FlashcardScreen;
