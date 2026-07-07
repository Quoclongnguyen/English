import { create } from 'zustand';
import {
  GrammarExercise,
  GrammarSubmitResponse,
  GrammarTopic,
} from '../types';
import { grammarService } from '../services/grammarService';

interface GrammarState {
  topic: GrammarTopic | null;
  exercises: GrammarExercise[];
  answers: Record<string, GrammarSubmitResponse>;
  isLoadingTopic: boolean;
  isLoadingExercises: boolean;
  isSubmitting: boolean;
  error: string | null;
  loadTopic: (topicId: string) => Promise<void>;
  loadExercises: (topicId: string) => Promise<void>;
  submitAnswer: (exerciseId: string, answer: string) => Promise<GrammarSubmitResponse>;
  clear: () => void;
}

const getMessage = (error: any, fallback: string) =>
  error.response?.data?.message || error.message || fallback;

export const useGrammarStore = create<GrammarState>((set) => ({
  topic: null,
  exercises: [],
  answers: {},
  isLoadingTopic: false,
  isLoadingExercises: false,
  isSubmitting: false,
  error: null,

  loadTopic: async topicId => {
    set({ isLoadingTopic: true, error: null });
    try {
      const topic = await grammarService.getTopic(topicId);
      set({ topic, isLoadingTopic: false });
    } catch (error: any) {
      const message = getMessage(error, 'Không thể tải bài ngữ pháp.');
      set({ isLoadingTopic: false, error: message });
      throw new Error(message);
    }
  },

  loadExercises: async topicId => {
    set({ isLoadingExercises: true, error: null });
    try {
      const exercises = await grammarService.getExercises(topicId);
      set({ exercises, isLoadingExercises: false });
    } catch (error: any) {
      const message = getMessage(error, 'Không thể tải bài tập ngữ pháp.');
      set({ isLoadingExercises: false, error: message });
      throw new Error(message);
    }
  },

  submitAnswer: async (exerciseId, answer) => {
    set({ isSubmitting: true, error: null });
    try {
      const result = await grammarService.submitAnswer(exerciseId, answer);
      set(state => ({
        answers: { ...state.answers, [exerciseId]: result },
        isSubmitting: false,
      }));
      return result;
    } catch (error: any) {
      const message = getMessage(error, 'Không thể chấm đáp án.');
      set({ isSubmitting: false, error: message });
      throw new Error(message);
    }
  },

  clear: () =>
    set({
      topic: null,
      exercises: [],
      answers: {},
      isLoadingTopic: false,
      isLoadingExercises: false,
      isSubmitting: false,
      error: null,
    }),
}));
