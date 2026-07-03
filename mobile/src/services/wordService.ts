import api from './api';
import {
  CameraWord,
  DailyVocabResponse,
  PhotoScanResult,
  PhotoDeckFilters,
  PhotoDeckResponse,
  SaveCameraWordsResponse,
  UserWordProgress,
  Word,
} from '../types';

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

  scanPhoto: async (
    base64Image: string,
    mimeType: string,
    localImageUri: string,
  ): Promise<PhotoScanResult> => {
    const response = await api.post('/api/words/camera-scan', { base64Image, mimeType });
    return { ...response.data, localImageUri };
  },

  saveCameraWords: async (
    photoScanId: string,
    selectedWords: CameraWord[],
  ): Promise<SaveCameraWordsResponse> => {
    const response = await api.post('/api/words/camera', { photoScanId, selectedWords });
    return response.data;
  },

  getPhotoDeck: async (filters: PhotoDeckFilters): Promise<PhotoDeckResponse> => {
    const response = await api.get('/api/words/photo-deck', { params: filters });
    return response.data;
  },
};
