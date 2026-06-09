import api from './api';
import { DailyTarget, LearningGoal, PlacementLevel, User } from '../types';

interface PlacementResultPayload {
  goal: LearningGoal;
  dailyTarget: DailyTarget;
  level: PlacementLevel;
}

export const onboardingService = {
  savePlacementResult: async (payload: PlacementResultPayload): Promise<User> => {
    const { data } = await api.post<{ user: User }>('/api/onboarding/placement-result', payload);
    return data.user;
  },
};
