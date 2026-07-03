import { create } from 'zustand';
import { wordService } from '../services/wordService';
import {
  CameraWord,
  PhotoScanResult,
  SaveCameraWordsResponse,
  UserWordProgress,
  Word,
} from '../types';

interface VocabState {
  dailyWords: Word[];
  dailyStory: string;
  vocabBank: Word[];
  reviewQueue: UserWordProgress[];
  isLoading: boolean;
  error: string | null;
  currentScanResult: PhotoScanResult | null;
  isScanning: boolean;
  isSavingScan: boolean;

  fetchDailyWords: () => Promise<void>;
  fetchVocabBank: (params?: { topic?: string; level?: string; status?: string }) => Promise<void>;
  fetchReviewQueue: () => Promise<void>;
  updateWordProgress: (wordId: string, quality: number) => Promise<void>;
  clearDailyWords: () => void;
  scanPhoto: (base64Image: string, mimeType: string, localImageUri: string) => Promise<void>;
  saveWordsFromScan: (selectedWords: CameraWord[]) => Promise<SaveCameraWordsResponse>;
  clearScanResult: () => void;
}

export const useVocabStore = create<VocabState>((set, get) => ({
  dailyWords: [],
  dailyStory: '',
  vocabBank: [],
  reviewQueue: [],
  isLoading: false,
  error: null,
  currentScanResult: null,
  isScanning: false,
  isSavingScan: false,

  fetchDailyWords: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await wordService.getDailyWords();
      set({
        dailyWords: response.words || [],
        dailyStory: response.story || '',
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch daily words', isLoading: false });
    }
  },

  fetchVocabBank: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const words = await wordService.getVocabBank(params);
      set({ vocabBank: words, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch vocab bank', isLoading: false });
    }
  },

  fetchReviewQueue: async () => {
    set({ isLoading: true, error: null });
    try {
      const queue = await wordService.getReviewQueue();
      set({ reviewQueue: queue, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch review queue', isLoading: false });
    }
  },

  updateWordProgress: async (wordId: string, quality: number) => {
    try {
      await wordService.updateProgress(wordId, quality);
      // We don't necessarily need to refresh the whole bank here,
      // but we could remove it from the local reviewQueue.
      const currentQueue = get().reviewQueue;
      set({ reviewQueue: currentQueue.filter((p) => p.wordId !== wordId) });
    } catch (error: any) {
      console.error('Update progress failed:', error);
    }
  },

  clearDailyWords: () => {
    set({ dailyWords: [], dailyStory: '' });
  },

  scanPhoto: async (base64Image, mimeType, localImageUri) => {
    set({ isScanning: true, error: null, currentScanResult: null });
    try {
      const result = await wordService.scanPhoto(base64Image, mimeType, localImageUri);
      set({ currentScanResult: result, isScanning: false });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Không thể phân tích ảnh.';
      set({ error: message, isScanning: false });
      throw new Error(message);
    }
  },

  saveWordsFromScan: async (selectedWords) => {
    const scan = get().currentScanResult;
    if (!scan) throw new Error('Không tìm thấy kết quả quét.');

    set({ isSavingScan: true, error: null });
    try {
      const result = await wordService.saveCameraWords(scan.photoScanId, selectedWords);
      set({ isSavingScan: false });
      return result;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Không thể lưu từ.';
      set({ error: message, isSavingScan: false });
      throw new Error(message);
    }
  },

  clearScanResult: () => set({ currentScanResult: null, error: null }),
}));
