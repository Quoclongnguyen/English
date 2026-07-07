import api from './api';
import {
  ListeningLesson,
  SaveListeningWordResponse,
} from '../types';

export const listeningService = {
  getLesson: async (lessonId: string): Promise<ListeningLesson> => {
    const response = await api.get(`/api/listening/lessons/${lessonId}`);
    return response.data.lesson;
  },

  saveWord: async (
    lessonId: string,
    segmentId: string,
    wordId: string,
  ): Promise<SaveListeningWordResponse> => {
    const response = await api.post(`/api/listening/lessons/${lessonId}/words`, {
      segmentId,
      wordId,
    });
    return response.data;
  },
};
