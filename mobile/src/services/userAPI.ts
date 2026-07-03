import api from './api';
import { UserStats } from '../types';

interface BuyStreakFreezeResponse {
  success: boolean;
  message: string;
  streakFreezes: number;
  availableXP: number;
}

export const userAPI = {
  async getUserStats(): Promise<UserStats> {
    const response = await api.get<UserStats>('/api/users/stats');
    return response.data;
  },

  async buyStreakFreeze(): Promise<BuyStreakFreezeResponse> {
    const response = await api.post<BuyStreakFreezeResponse>('/api/users/streak-freeze/buy');
    return response.data;
  },
};
