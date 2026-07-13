import api from './api';
import { FeedbackItem, SubmitFeedbackPayload } from '../types';

export const feedbackService = {
  submitFeedback: async (payload: SubmitFeedbackPayload): Promise<FeedbackItem> => {
    const response = await api.post('/api/feedback', payload);
    return response.data.feedback;
  },

  getMyFeedback: async (): Promise<FeedbackItem[]> => {
    const response = await api.get('/api/feedback/my');
    return response.data.feedback;
  },
};
