import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PhotoDeckItem, PhotoDeckFilters } from '../types';
import { resolveImageUrl } from '../utils/imageUrl';
import { useThemeStore } from '../stores/themeStore';
import { useVocabStore } from '../stores/vocabStore';
import { Typography } from '../constants/typography';
import { PhotoDetailModal } from './PhotoDetailModal';

const SORTS: Array<{ value: PhotoDeckFilters['sort']; label: string }> = [
  { value: 'recent', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'alphabetical', label: 'A–Z' },
];

export const PhotoDeckView = () => {
  const { colors } = useThemeStore();
  const {
    photoDeck,
    photoDeckFilters,
    photoDeckPages,
    photoDeckTotal,
    isLoadingPhotoDeck,
    loadPhotoDeck,
  } = useVocabStore();
  const [search, setSearch] = useState(photoDeckFilters.search || '');
  const [selectedItem, setSelectedItem] = useState<PhotoDeckItem | null>(null);

  useEffect(() => {
    loadPhotoDeck({ page: 1 });
  }, [loadPhotoDeck]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (photoDeckFilters.search || '')) {
        loadPhotoDeck({ search: search.trim() || undefined, page: 1 });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search, photoDeckFilters.search, loadPhotoDeck]);

  const changeSort = (sort: PhotoDeckFilters['sort']) => {
    loadPhotoDeck({ sort, page: 1 });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Tìm theo từ hoặc câu chuyện..."
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.text }]}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={19} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.sortRow}>
        {SORTS.map((sort) => {
          const active = photoDeckFilters.sort === sort.value;
          return (
            <TouchableOpacity
              key={sort.value}
              onPress={() => changeSort(sort.value)}
              style={[
                styles.sortButton,
                {
                  backgroundColor: active ? `${colors.accent}26` : colors.surface,
                  borderColor: active ? colors.accent : colors.border,
                },
              ]}
            >
              <Text style={[styles.sortText, { color: active ? colors.accent : colors.textMuted }]}>{sort.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingPhotoDeck}
            onRefresh={() => loadPhotoDeck()}
            tintColor={colors.primary}
          />
        }
      >
        {isLoadingPhotoDeck && photoDeck.length === 0 ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : null}
        {!isLoadingPhotoDeck && photoDeck.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📷</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Photo Deck đang trống</Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Quét ảnh và lưu ít nhất một từ để tạo bộ thẻ đầu tiên.</Text>
          </View>
        ) : null}
        <View style={styles.grid}>
          {photoDeck.map((item) => (
            <TouchableOpacity
              key={item._id}
              activeOpacity={0.85}
              onPress={() => setSelectedItem(item)}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Image source={{ uri: resolveImageUrl(item.photoUrl) }} style={styles.photo} />
              <View style={styles.cardCopy}>
                <Text numberOfLines={2} style={[styles.story, { color: colors.text }]}>{item.story}</Text>
                <View style={styles.meta}>
                  <Text style={[styles.wordCount, { color: colors.primary }]}>{item.words.length} từ</Text>
                  <Text style={[styles.date, { color: colors.textMuted }]}>
                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {photoDeckPages > 1 ? (
          <View style={styles.pagination}>
            <TouchableOpacity
              disabled={photoDeckFilters.page <= 1 || isLoadingPhotoDeck}
              onPress={() => loadPhotoDeck({ page: photoDeckFilters.page - 1 })}
              style={[styles.pageButton, { borderColor: colors.border }, photoDeckFilters.page <= 1 && styles.disabled]}
            >
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.pageText, { color: colors.textMuted }]}>
              {photoDeckFilters.page}/{photoDeckPages} · {photoDeckTotal} ảnh
            </Text>
            <TouchableOpacity
              disabled={photoDeckFilters.page >= photoDeckPages || isLoadingPhotoDeck}
              onPress={() => loadPhotoDeck({ page: photoDeckFilters.page + 1 })}
              style={[styles.pageButton, { borderColor: colors.border }, photoDeckFilters.page >= photoDeckPages && styles.disabled]}
            >
              <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
      <PhotoDetailModal item={selectedItem} visible={!!selectedItem} onClose={() => setSelectedItem(null)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12, paddingHorizontal: 16 },
  searchBox: { height: 48, borderRadius: 16, borderWidth: 1, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 9 },
  input: { flex: 1, fontFamily: Typography.fontFamily.regular, fontSize: 14 },
  sortRow: { flexDirection: 'row', gap: 8 },
  sortButton: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  sortText: { fontFamily: Typography.fontFamily.bold, fontSize: 11 },
  scroll: { paddingBottom: 32 },
  loader: { marginTop: 70 },
  empty: { alignItems: 'center', gap: 8, paddingHorizontal: 30, paddingTop: 60 },
  emptyEmoji: { fontSize: 42 },
  emptyTitle: { fontFamily: Typography.fontFamily.bold, fontSize: 20 },
  emptyText: { fontFamily: Typography.fontFamily.regular, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '48%', borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  photo: { width: '100%', height: 130, backgroundColor: '#22222F' },
  cardCopy: { padding: 11, gap: 9 },
  story: { fontFamily: Typography.fontFamily.semiBold, fontSize: 12, lineHeight: 17 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wordCount: { fontFamily: Typography.fontFamily.bold, fontSize: 11 },
  date: { fontFamily: Typography.fontFamily.mono, fontSize: 9 },
  pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18, paddingTop: 22 },
  pageButton: { width: 42, height: 38, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  pageText: { fontFamily: Typography.fontFamily.mono, fontSize: 11 },
  disabled: { opacity: 0.35 },
});
