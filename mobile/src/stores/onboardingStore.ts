import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onboardingService } from '../services/onboardingService';
import { useAuthStore } from './authStore';
import { DailyTarget, LearningGoal, OnboardingProfile, PlacementLevel } from '../types';

const ONBOARDING_STORAGE_KEY = '@lexis/onboarding_profile';

interface OnboardingStore extends OnboardingProfile {
  isInitializing: boolean;
  setGoal: (goal: LearningGoal) => void;
  setDailyTarget: (dailyTarget: DailyTarget) => void;
  setLevel: (level: PlacementLevel) => void;
  completeOnboarding: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const initialProfile: OnboardingProfile = {
  goal: null,
  dailyTarget: null,
  level: null,
  isCompleted: false,
};

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  ...initialProfile,
  isInitializing: true,

  setGoal: (goal) => set({ goal }),
  setDailyTarget: (dailyTarget) => set({ dailyTarget }),
  setLevel: (level) => set({ level }),

  completeOnboarding: async () => {
    const { goal, dailyTarget, level } = get();

    if (!goal || !dailyTarget || !level) {
      throw new Error('Onboarding profile is incomplete');
    }

    const user = await onboardingService.savePlacementResult({ goal, dailyTarget, level });
    useAuthStore.getState().setUser(user);

    const profile: OnboardingProfile = {
      goal,
      dailyTarget,
      level,
      isCompleted: true,
    };

    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(profile));
    set(profile);
  },

  loadFromStorage: async () => {
    try {
      const rawProfile = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);

      if (!rawProfile) {
        set({ isInitializing: false });
        return;
      }

      const profile = JSON.parse(rawProfile) as OnboardingProfile;
      set({ ...profile, isInitializing: false });
    } catch {
      set({ ...initialProfile, isInitializing: false });
    }
  },

  resetOnboarding: async () => {
    await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
    set({ ...initialProfile, isInitializing: false });
  },
}));
