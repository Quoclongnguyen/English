/**
 * Master XP economy configuration
 * Ensure all earning paths are balanced
 */

export const XP_ECONOMY = {
  // ===== EARNING =====
  EARN: {
    // Review/Study
    reviewWord: 5,          // Review 1 flashcard
    markMastered: 5,        // Mark word as learned
    dailyStreakBonus: 20,   // For studying 1+ item today
    weeklyStreakBonus: 50,  // For 7-day streak

    // Photo Scans
    photoScanNewWord: 10,   // Per new word saved
    photoScanBase: 0,       // Base XP for scan (words give XP)
    photoScanBadge: 20,     // When unlock camera badge

    // Badges
    badgeUnlock: {
      common: 30,      // streak_3, words_10, camera_1
      uncommon: 100,   // streak_7, words_50, camera_5
      rare: 300,       // streak_30, words_100
      epic: 500        // Future badges
    }
  },

  // ===== SPENDING =====
  SPEND: {
    streakFreeze: 150,      // Buy 1 freeze
    powerUp: {
      skipReview: 30,
      extraHint: 20
    }
  },

  // ===== CONVERSIONS =====
  XP_PER_LEVEL: 500,        // Every 500 XP = 1 level
};

/**
 * Daily/Weekly caps to prevent farming
 */
export const RATE_CAPS = {
  // Max XP earned per day from review
  maxDailyReviewXP: 500,
  
  // Max XP from photo scans per day
  maxDailyPhotoXP: 200,
  
  // Max total daily XP
  maxDailyXP: 1000,
  
  // Photo scan limits
  maxPhotosPerDay: 5,
  maxPhotosPerMonth: 50
};
