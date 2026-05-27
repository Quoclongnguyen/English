import api from './api';
import { AuthResponse, LoginPayload, RegisterPayload } from '../types';

export const authService = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/api/auth/register', payload);
    return data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/api/auth/login', payload);
    return data;
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const { data } = await api.post('/api/auth/refresh', { refreshToken });
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },
};
