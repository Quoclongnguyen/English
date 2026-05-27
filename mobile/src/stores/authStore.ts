import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import { AuthState, LoginPayload, RegisterPayload, User } from '../types';
import { STORAGE_KEYS } from '../services/api';

interface AuthStore extends AuthState {
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // Initial state
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  // Load tokens from AsyncStorage on app start
  loadFromStorage: async () => {
    try {
      const [accessToken, refreshToken] = await AsyncStorage.multiGet([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
      ]);

      const access = accessToken[1];
      const refresh = refreshToken[1];

      if (access && refresh) {
        set({ accessToken: access, refreshToken: refresh, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  // Login
  login: async (payload: LoginPayload) => {
    set({ isLoading: true });
    try {
      const { accessToken, refreshToken, user } = await authService.login(payload);

      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

      set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Register
  register: async (payload: RegisterPayload) => {
    set({ isLoading: true });
    try {
      const { accessToken, refreshToken, user } = await authService.register(payload);

      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

      set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // Vẫn logout local dù API fail
    } finally {
      await AsyncStorage.multiRemove([STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.REFRESH_TOKEN]);
      set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
    }
  },

  setUser: (user: User) => set({ user }),
}));
