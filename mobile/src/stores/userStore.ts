import { create } from 'zustand';
import { AxiosError } from 'axios';
import { userAPI } from '../services/userAPI';
import { UserStats } from '../types';

interface ApiError {
  error?: string;
  message?: string;
}

interface UserStore {
  stats: UserStats | null;
  loading: boolean;
  refreshing: boolean;
  buyingFreeze: boolean;
  error: string | null;
  loadUserStats: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  buyStreakFreeze: () => Promise<string>;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError | undefined;
    return data?.error || data?.message || 'Không thể kết nối đến máy chủ.';
  }
  return error instanceof Error ? error.message : 'Đã có lỗi xảy ra.';
};

export const useUserStore = create<UserStore>((set) => ({
  stats: null,
  loading: false,
  refreshing: false,
  buyingFreeze: false,
  error: null,

  loadUserStats: async () => {
    set({ loading: true, error: null });
    try {
      const stats = await userAPI.getUserStats();
      set({ stats, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },

  refreshUserData: async () => {
    set({ refreshing: true, error: null });
    try {
      const stats = await userAPI.getUserStats();
      set({ stats, refreshing: false });
    } catch (error) {
      set({ error: getErrorMessage(error), refreshing: false });
    }
  },

  buyStreakFreeze: async () => {
    set({ buyingFreeze: true, error: null });
    try {
      const result = await userAPI.buyStreakFreeze();
      set((state) => ({
        buyingFreeze: false,
        stats: state.stats
          ? {
              ...state.stats,
              streakFreezes: result.streakFreezes,
              availableXP: result.availableXP,
            }
          : null,
      }));
      return result.message;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ buyingFreeze: false });
      throw new Error(message);
    }
  },
}));
