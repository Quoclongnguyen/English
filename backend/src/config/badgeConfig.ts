/**
 * Complete badge definitions with unlock requirements
 */

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'streak' | 'vocabulary' | 'photoScans';
    value: number;
  };
  xpReward: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
  resetOnStreakBreak: boolean;
}

export const BADGE_DEFINITIONS: Record<string, BadgeDefinition> = {
  // ===== STREAK BADGES =====
  streak_3: {
    id: 'streak_3',
    name: '🔥 Lửa 3 Ngày',
    description: 'Học liên tục 3 ngày',
    icon: '🔥',
    requirement: { type: 'streak', value: 3 },
    xpReward: 50,
    rarity: 'common',
    resetOnStreakBreak: true
  },
  
  streak_7: {
    id: 'streak_7',
    name: '⭐ Tuần Vàng',
    description: 'Học liên tục 7 ngày',
    icon: '⭐',
    requirement: { type: 'streak', value: 7 },
    xpReward: 150,
    rarity: 'uncommon',
    resetOnStreakBreak: true
  },
  
  streak_30: {
    id: 'streak_30',
    name: '👑 Tháng Quân Vương',
    description: 'Học liên tục 30 ngày',
    icon: '👑',
    requirement: { type: 'streak', value: 30 },
    xpReward: 500,
    rarity: 'rare',
    resetOnStreakBreak: true
  },
  
  // ===== VOCABULARY BADGES =====
  words_10: {
    id: 'words_10',
    name: '📚 Starter',
    description: 'Học 10 từ mới',
    icon: '📚',
    requirement: { type: 'vocabulary', value: 10 },
    xpReward: 30,
    rarity: 'common',
    resetOnStreakBreak: false
  },
  
  words_50: {
    id: 'words_50',
    name: '🧠 Scholar',
    description: 'Học 50 từ mới',
    icon: '🧠',
    requirement: { type: 'vocabulary', value: 50 },
    xpReward: 100,
    rarity: 'uncommon',
    resetOnStreakBreak: false
  },
  
  words_100: {
    id: 'words_100',
    name: '🎓 Master',
    description: 'Học 100 từ mới',
    icon: '🎓',
    requirement: { type: 'vocabulary', value: 100 },
    xpReward: 300,
    rarity: 'rare',
    resetOnStreakBreak: false
  },
  
  // ===== CAMERA BADGES =====
  camera_1: {
    id: 'camera_1',
    name: '📸 Photographer',
    description: 'Quét 1 ảnh bằng camera',
    icon: '📸',
    requirement: { type: 'photoScans', value: 1 },
    xpReward: 20,
    rarity: 'common',
    resetOnStreakBreak: false
  },
  
  camera_5: {
    id: 'camera_5',
    name: '🎬 Filmmaker',
    description: 'Quét 5 ảnh bằng camera',
    icon: '🎬',
    requirement: { type: 'photoScans', value: 5 },
    xpReward: 80,
    rarity: 'uncommon',
    resetOnStreakBreak: false
  }
};

/**
 * List of badge IDs that should be deactivated when streak breaks
 */
export const BADGES_AFFECTED_BY_STREAK_BREAK = [
  'streak_3',
  'streak_7',
  'streak_30'
];
