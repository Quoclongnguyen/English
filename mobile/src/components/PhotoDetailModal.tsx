import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PhotoDeckItem } from '../types';
import { resolveImageUrl } from '../utils/imageUrl';
import { useThemeStore } from '../stores/themeStore';
import { Typography } from '../constants/typography';

interface PhotoDetailModalProps {
  item: PhotoDeckItem | null;
  visible: boolean;
  onClose: () => void;
}

export const PhotoDetailModal = ({ item, visible, onClose }: PhotoDetailModalProps) => {
  const { colors } = useThemeStore();
  const [flippedWords, setFlippedWords] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!visible) setFlippedWords(new Set());
  }, [visible]);

  if (!item) return null;

  const flip = (word: string) => {
    setFlippedWords((current) => {
      const next = new Set(current);
      if (next.has(word)) next.delete(word);
      else next.add(word);
      return next;
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={27} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Photo Story</Text>
          <View style={styles.closeButton} />
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Image source={{ uri: resolveImageUrl(item.photoUrl) }} style={styles.image} />
          <View style={[styles.storyBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.storyLabel, { color: colors.accent }]}>✦ MINI STORY</Text>
            <Text style={[styles.story, { color: colors.text }]}>{item.story}</Text>
          </View>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Flashcards</Text>
            <Text style={[styles.hint, { color: colors.textMuted }]}>Chạm vào thẻ để lật</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cards}>
            {item.words.map((word) => {
              const flipped = flippedWords.has(word.word);
              return (
                <TouchableOpacity
                  key={word.word}
                  activeOpacity={0.85}
                  onPress={() => flip(word.word)}
                  style={[
                    styles.flashcard,
                    {
                      backgroundColor: flipped ? `${colors.accent}26` : colors.surface,
                      borderColor: flipped ? colors.accent : colors.border,
                    },
                  ]}
                >
                  {flipped ? (
                    <>
                      <Text style={[styles.meaning, { color: colors.text }]}>{word.meaning_vi}</Text>
                      <Text style={[styles.type, { color: colors.accent }]}>{word.type}</Text>
                      <Text style={[styles.example, { color: colors.textMuted }]}>“{word.example}”</Text>
                    </>
                  ) : (
                    <>
                      <Text style={[styles.word, { color: colors.text }]}>{word.word}</Text>
                      <Text style={[styles.phonetic, { color: colors.accent }]}>{word.phonetic}</Text>
                      <Ionicons name="sync-outline" size={22} color={colors.textMuted} />
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { height: 64, paddingHorizontal: 16, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  closeButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: Typography.fontFamily.bold, fontSize: 18 },
  content: { gap: 18, padding: 18, paddingBottom: 40 },
  image: { width: '100%', height: 260, borderRadius: 24, backgroundColor: '#22222F' },
  storyBox: { borderWidth: 1, borderRadius: 20, padding: 18, gap: 9 },
  storyLabel: { fontFamily: Typography.fontFamily.mono, fontSize: 11, letterSpacing: 1 },
  story: { fontFamily: Typography.fontFamily.regular, fontSize: 15, lineHeight: 23 },
  sectionTitle: { fontFamily: Typography.fontFamily.bold, fontSize: 21 },
  hint: { fontFamily: Typography.fontFamily.regular, fontSize: 12, marginTop: 3 },
  cards: { gap: 12, paddingRight: 18 },
  flashcard: { width: 260, minHeight: 210, borderRadius: 24, borderWidth: 1, padding: 22, alignItems: 'center', justifyContent: 'center', gap: 11 },
  word: { fontFamily: Typography.fontFamily.bold, fontSize: 30, textAlign: 'center' },
  phonetic: { fontFamily: Typography.fontFamily.mono, fontSize: 14 },
  meaning: { fontFamily: Typography.fontFamily.bold, fontSize: 23, textAlign: 'center' },
  type: { fontFamily: Typography.fontFamily.mono, fontSize: 12, textTransform: 'uppercase' },
  example: { fontFamily: Typography.fontFamily.regular, fontSize: 13, lineHeight: 19, textAlign: 'center', fontStyle: 'italic' },
});
