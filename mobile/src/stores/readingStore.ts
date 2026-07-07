import { create } from 'zustand';
import {
  ReadingExplanation,
  ReadingPassage,
  ReadingSummary,
} from '../types';
import { readingService } from '../services/readingService';

interface ReadingState {
  passage: ReadingPassage | null;
  explanation: ReadingExplanation | null;
  summary: ReadingSummary | null;
  selectedSectionId: string | null;
  isLoading: boolean;
  isExplaining: boolean;
  isLoadingSummary: boolean;
  error: string | null;
  loadPassage: (passageId: string) => Promise<void>;
  explainSection: (sectionId: string) => Promise<void>;
  loadSummary: () => Promise<void>;
  clearExplanation: () => void;
  clear: () => void;
}

const getMessage = (error: any, fallback: string) =>
  error.response?.data?.message || error.message || fallback;

export const useReadingStore = create<ReadingState>((set, get) => ({
  passage: null,
  explanation: null,
  summary: null,
  selectedSectionId: null,
  isLoading: false,
  isExplaining: false,
  isLoadingSummary: false,
  error: null,

  loadPassage: async passageId => {
    set({ isLoading: true, error: null });
    try {
      const passage = await readingService.getPassage(passageId);
      set({ passage, isLoading: false });
    } catch (error: any) {
      const message = getMessage(error, 'Không thể tải bài đọc.');
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  explainSection: async sectionId => {
    const passage = get().passage;
    if (!passage) throw new Error('Bài đọc chưa sẵn sàng.');

    set({
      selectedSectionId: sectionId,
      explanation: null,
      isExplaining: true,
      error: null,
    });
    try {
      const explanation = await readingService.explainSection(passage.id, sectionId);
      set({ explanation, isExplaining: false });
    } catch (error: any) {
      const message = getMessage(error, 'Không thể giải thích đoạn văn.');
      set({ isExplaining: false, error: message });
      throw new Error(message);
    }
  },

  loadSummary: async () => {
    const passage = get().passage;
    if (!passage) throw new Error('Bài đọc chưa sẵn sàng.');
    if (get().summary) return;

    set({ isLoadingSummary: true, error: null });
    try {
      const summary = await readingService.getSummary(passage.id);
      set({ summary, isLoadingSummary: false });
    } catch (error: any) {
      const message = getMessage(error, 'Không thể tạo tóm tắt.');
      set({ isLoadingSummary: false, error: message });
      throw new Error(message);
    }
  },

  clearExplanation: () =>
    set({ explanation: null, selectedSectionId: null, isExplaining: false }),

  clear: () =>
    set({
      passage: null,
      explanation: null,
      summary: null,
      selectedSectionId: null,
      error: null,
    }),
}));
