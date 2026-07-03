import api from './api';
import { Word, DailyVocabResponse, UserWordProgress } from '../types';

export const wordService = {
  getDailyWords: async (): Promise<DailyVocabResponse> => {
    const response = await api.get('/api/words/daily');
    return response.data;
  },

  getVocabBank: async (params?: { topic?: string; level?: string; status?: string }): Promise<Word[]> => {
    const response = await api.get('/api/words/bank', { params });
    return response.data;
  },

  getReviewQueue: async (): Promise<UserWordProgress[]> => {
    const response = await api.get('/api/words/review');
    return response.data;
  },

  updateProgress: async (wordId: string, quality: number): Promise<UserWordProgress> => {
    const response = await api.post('/api/words/progress', { wordId, quality });
    return response.data;
  },
};
