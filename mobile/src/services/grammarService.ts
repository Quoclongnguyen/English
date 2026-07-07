import api from './api';
import {
  GrammarExercise,
  GrammarSubmitResponse,
  GrammarTopic,
  GrammarTopicSummary,
} from '../types';

export const grammarService = {
  listTopics: async (): Promise<GrammarTopicSummary[]> => {
    const response = await api.get('/api/grammar/topics');
    return response.data.topics;
  },

  getTopic: async (topicId: string): Promise<GrammarTopic> => {
    const response = await api.get(`/api/grammar/topics/${topicId}`);
    return response.data.topic;
  },

  getExercises: async (topicId: string): Promise<GrammarExercise[]> => {
    const response = await api.get(`/api/grammar/topics/${topicId}/exercises`);
    return response.data.exercises;
  },

  submitAnswer: async (
    exerciseId: string,
    answer: string,
  ): Promise<GrammarSubmitResponse> => {
    const response = await api.post(`/api/grammar/exercises/${exerciseId}/submit`, {
      answer,
    });
    return response.data;
  },
};
