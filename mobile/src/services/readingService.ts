import api from './api';
import {
  ReadingExplanation,
  ReadingPassage,
  ReadingSummary,
} from '../types';

export const readingService = {
  getPassage: async (passageId: string): Promise<ReadingPassage> => {
    const response = await api.get(`/api/reading/passages/${passageId}`);
    return response.data.passage;
  },

  explainSection: async (
    passageId: string,
    sectionId: string,
  ): Promise<ReadingExplanation> => {
    const response = await api.post(`/api/reading/passages/${passageId}/explain`, {
      sectionId,
    });
    return response.data;
  },

  getSummary: async (passageId: string): Promise<ReadingSummary> => {
    const response = await api.post(`/api/reading/passages/${passageId}/summary`);
    return response.data;
  },
};
