import { User, IUser } from '../models/User';
import {
  BADGE_DEFINITIONS,
  BADGES_AFFECTED_BY_STREAK_BREAK
} from '../config/badgeConfig';

export class BadgeService {
  /**
   * Check and unlock all applicable badges for user
   * Returns list of newly unlocked badge IDs
   */
  async checkAndUnlockBadges(userId: string): Promise<string[]> {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const newlyUnlocked: string[] = [];

    // Iterate through all badge definitions
    for (const [badgeId, badgeDef] of Object.entries(BADGE_DEFINITIONS)) {
      // Skip if already unlocked and active
      const alreadyUnlocked = user.badges.some(
        b => b.badgeId === badgeId && b.isActive
      );
      if (alreadyUnlocked) continue;

      // Check if requirement is met
      const meetsRequirement = this.checkBadgeRequirement(user, badgeDef.requirement);

      if (meetsRequirement) {
        // If the badge exists but was deactivated, reactivate it, otherwise add new
        const existingBadge = user.badges.find(b => b.badgeId === badgeId);
        if (existingBadge) {
          existingBadge.isActive = true;
          existingBadge.unlockedAt = new Date();
        } else {
          user.badges.push({
            badgeId,
            unlockedAt: new Date(),
            isActive: true
          } as any);
        }

        // Award XP
        user.totalXP += badgeDef.xpReward;
        newlyUnlocked.push(badgeId);

        console.log(`🏆 Badge unlocked for user ${userId}: ${badgeId}`);
      }
    }

    if (newlyUnlocked.length > 0) {
      await user.save();
    }

    return newlyUnlocked;
  }

  /**
   * Handle streak break: deactivate streak-related badges
   * Called when streak is broken
   */
  async handleStreakBreak(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) return;

    // Deactivate affected badges
    user.badges.forEach(badge => {
      if (BADGES_AFFECTED_BY_STREAK_BREAK.includes(badge.badgeId)) {
        badge.isActive = false;
      }
    });

    // Reset streak count
    user.currentStreak.count = 0;
    user.streak = 0;

    await user.save();

    console.log(`❌ Streak broken for user ${userId}`);
  }

  /**
   * Check if user meets a specific badge requirement
   */
  private checkBadgeRequirement(user: IUser, requirement: any): boolean {
    switch (requirement.type) {
      case 'streak':
        return user.currentStreak.count >= requirement.value;

      case 'vocabulary':
        // Count total vocabulary (photo + review combined)
        return user.vocabulary.length >= requirement.value;

      case 'photoScans':
        // Count total photo scans from studyHistory
        const totalPhotos = user.studyHistory.reduce(
          (sum, day) => sum + day.photosScanned,
          0
        );
        return totalPhotos >= requirement.value;

      default:
        return false;
    }
  }

  /**
   * Get all badges with user's progress
   * Used for ProfileScreen badge display
   */
  async getUserBadges(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    return Object.entries(BADGE_DEFINITIONS).map(([id, def]) => {
      const userBadge = user.badges.find(b => b.badgeId === id);
      const currentProgress = this.calculateBadgeProgress(user, def.requirement);

      return {
        id: def.id,
        name: def.name,
        description: def.description,
        icon: def.icon,
        unlocked: userBadge?.isActive ?? false,
        unlockedAt: userBadge?.unlockedAt,
        xpReward: def.xpReward,
        rarity: def.rarity,
        requirement: def.requirement,
        currentProgress,
        progress: Math.min(
          (currentProgress / def.requirement.value) * 100,
          100
        )
      };
    });
  }

  /**
   * Calculate current progress towards badge requirement
   */
  private calculateBadgeProgress(user: IUser, requirement: any): number {
    switch (requirement.type) {
      case 'streak':
        return user.currentStreak.count;
      case 'vocabulary':
        return user.vocabulary.length;
      case 'photoScans':
        return user.studyHistory.reduce((sum, day) => sum + day.photosScanned, 0);
      default:
        return 0;
    }
  }
}
