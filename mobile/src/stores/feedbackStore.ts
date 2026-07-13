import { create } from 'zustand';
import { FeedbackItem, SubmitFeedbackPayload } from '../types';
import { feedbackService } from '../services/feedbackService';

interface FeedbackState {
  lastFeedback: FeedbackItem | null;
  isSubmitting: boolean;
  error: string | null;
  submitFeedback: (payload: SubmitFeedbackPayload) => Promise<FeedbackItem>;
  clear: () => void;
}

const getMessage = (error: any, fallback: string) =>
  error.response?.data?.message || error.message || fallback;

export const useFeedbackStore = create<FeedbackState>((set) => ({
  lastFeedback: null,
  isSubmitting: false,
  error: null,

  submitFeedback: async payload => {
    set({ isSubmitting: true, error: null });
    try {
      const feedback = await feedbackService.submitFeedback(payload);
      set({ lastFeedback: feedback, isSubmitting: false });
      return feedback;
    } catch (error: any) {
      const message = getMessage(error, 'Không thể gửi feedback.');
      set({ isSubmitting: false, error: message });
      throw new Error(message);
    }
  },

  clear: () => set({ lastFeedback: null, isSubmitting: false, error: null }),
}));
