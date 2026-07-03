import React, { useMemo, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Typography } from '../../constants/typography';
import { useThemeStore } from '../../stores/themeStore';
import { useVocabStore } from '../../stores/vocabStore';

const CameraChecklistScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useThemeStore();
  const { currentScanResult, isSavingScan, saveWordsFromScan, clearScanResult } = useVocabStore();
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(currentScanResult?.words.map((word) => word.word) || []),
  );

  const selectedWords = useMemo(
    () => currentScanResult?.words.filter((word) => selected.has(word.word)) || [],
    [currentScanResult, selected],
  );

  const toggleWord = (word: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(word)) next.delete(word);
      else next.add(word);
      return next;
    });
  };

  const handleSave = async () => {
    try {
      const result = await saveWordsFromScan(selectedWords);
      Alert.alert(
        `Đã lưu ${result.newWordsCount} từ mới`,
        `${result.duplicatesCount ? `Đã học trước đó: ${result.duplicatesCount}. ` : ''}+${result.xpEarned} XP`,
        [{ text: 'Xong', onPress: () => { clearScanResult(); navigation.navigate('Tabs', { screen: 'VocabBank' }); } }],
      );
    } catch (error) {
      Alert.alert('Không thể lưu từ', error instanceof Error ? error.message : 'Vui lòng thử lại.');
    }
  };

  if (!currentScanResult) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.text }]}>Không còn kết quả quét.</Text>
        <Button title="Quay lại Camera" onPress={() => navigation.goBack()} color="purple" />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Chọn từ muốn học</Text>
        <Text style={[styles.count, { color: colors.primary }]}>{selected.size}/{currentScanResult.words.length}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: currentScanResult.localImageUri }} style={styles.photo} />
        <Card style={styles.storyCard}>
          <View style={styles.storyHeading}>
            <Ionicons name="sparkles" size={18} color={colors.accent} />
            <Text style={[styles.storyLabel, { color: colors.accent }]}>MINI STORY</Text>
          </View>
          <Text style={[styles.story, { color: colors.text }]}>{currentScanResult.story}</Text>
        </Card>
        <View style={styles.listHeading}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Gemini tìm thấy</Text>
          <TouchableOpacity
            onPress={() => setSelected(selected.size === currentScanResult.words.length ? new Set() : new Set(currentScanResult.words.map((word) => word.word)))}
          >
            <Text style={[styles.selectAll, { color: colors.primary }]}>
              {selected.size === currentScanResult.words.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </Text>
          </TouchableOpacity>
        </View>
        {currentScanResult.words.map((word) => {
          const checked = selected.has(word.word);
          return (
            <TouchableOpacity key={word.word} activeOpacity={0.8} onPress={() => toggleWord(word.word)}>
              <Card style={[styles.wordCard, checked && { borderColor: colors.primary }]}>
                <View style={[styles.checkbox, { borderColor: checked ? colors.primary : colors.border, backgroundColor: checked ? colors.primary : 'transparent' }]}>
                  {checked ? <Ionicons name="checkmark" size={17} color="#082014" /> : null}
                </View>
                <View style={styles.wordCopy}>
                  <View style={styles.wordTop}>
                    <Text style={[styles.word, { color: colors.text }]}>{word.word}</Text>
                    <Text style={[styles.phonetic, { color: colors.accent }]}>{word.phonetic}</Text>
                  </View>
                  <Text style={[styles.meaning, { color: colors.textMuted }]}>{word.meaning_vi}</Text>
                  <Text style={[styles.example, { color: colors.textMuted }]} numberOfLines={2}>“{word.example}”</Text>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Button
          title={`Lưu ${selected.size} từ`}
          onPress={handleSave}
          color="green"
          loading={isSavingScan}
          disabled={selected.size === 0}
          icon={<Ionicons name="bookmark-outline" size={19} color="#082014" />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 32 },
  emptyText: { fontFamily: Typography.fontFamily.bold, fontSize: 20 },
  header: { height: 64, paddingHorizontal: 16, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 38, height: 38, justifyContent: 'center' },
  headerTitle: { fontFamily: Typography.fontFamily.bold, fontSize: 18 },
  count: { width: 38, textAlign: 'right', fontFamily: Typography.fontFamily.mono, fontSize: 12 },
  content: { gap: 14, padding: 18, paddingBottom: 110 },
  photo: { width: '100%', height: 220, borderRadius: 24, backgroundColor: '#22222F' },
  storyCard: { gap: 8 },
  storyHeading: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  storyLabel: { fontFamily: Typography.fontFamily.mono, fontSize: 11, letterSpacing: 1 },
  story: { fontFamily: Typography.fontFamily.regular, fontSize: 15, lineHeight: 23 },
  listHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  sectionTitle: { fontFamily: Typography.fontFamily.bold, fontSize: 20 },
  selectAll: { fontFamily: Typography.fontFamily.bold, fontSize: 12 },
  wordCard: { padding: 15, flexDirection: 'row', gap: 12 },
  checkbox: { width: 25, height: 25, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  wordCopy: { flex: 1, gap: 3 },
  wordTop: { flexDirection: 'row', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' },
  word: { fontFamily: Typography.fontFamily.bold, fontSize: 18 },
  phonetic: { fontFamily: Typography.fontFamily.mono, fontSize: 12 },
  meaning: { fontFamily: Typography.fontFamily.semiBold, fontSize: 14 },
  example: { fontFamily: Typography.fontFamily.regular, fontSize: 12, lineHeight: 18, fontStyle: 'italic' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, paddingBottom: 24, borderTopWidth: 1 },
});

export default CameraChecklistScreen;
