import { create } from 'zustand';
import { ListeningLesson } from '../types';
import { listeningService } from '../services/listeningService';

interface ListeningState {
  lesson: ListeningLesson | null;
  isLoading: boolean;
  isSavingWord: boolean;
  error: string | null;
  savedWordIds: string[];
  loadLesson: (lessonId: string) => Promise<void>;
  saveWord: (segmentId: string, wordId: string) => Promise<boolean>;
  clear: () => void;
}

const getMessage = (error: any, fallback: string) =>
  error.response?.data?.message || error.message || fallback;

export const useListeningStore = create<ListeningState>((set, get) => ({
  lesson: null,
  isLoading: false,
  isSavingWord: false,
  error: null,
  savedWordIds: [],

  loadLesson: async lessonId => {
    set({ isLoading: true, error: null, savedWordIds: [] });
    try {
      const lesson = await listeningService.getLesson(lessonId);
      set({ lesson, isLoading: false });
    } catch (error: any) {
      const message = getMessage(error, 'Không thể tải bài nghe.');
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  saveWord: async (segmentId, wordId) => {
    const lesson = get().lesson;
    if (!lesson) throw new Error('Bài nghe chưa sẵn sàng.');

    set({ isSavingWord: true, error: null });
    try {
      const result = await listeningService.saveWord(lesson.id, segmentId, wordId);
      set(state => ({
        isSavingWord: false,
        savedWordIds: state.savedWordIds.includes(wordId)
          ? state.savedWordIds
          : [...state.savedWordIds, wordId],
      }));
      return result.alreadySaved;
    } catch (error: any) {
      const message = getMessage(error, 'Không thể lưu từ.');
      set({ error: message, isSavingWord: false });
      throw new Error(message);
    }
  },

  clear: () => set({ lesson: null, error: null, savedWordIds: [] }),
}));
