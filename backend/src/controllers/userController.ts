import { Response } from 'express';
import { User } from '../models/User';
import { BadgeService } from '../services/badgeService';

const badgeService = new BadgeService();
const STREAK_FREEZE_COST = 150; // XP

interface AuthRequest extends Request {
  user?: any;
  body: any;
}

/**
 * GET /api/users/stats
 * Fetch user summary and weekly study metrics for ProfileScreen
 */
export async function getUserStats(req: any, res: Response) {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const availableXP = user.totalXP - user.totalXPSpent;

    // Get today's study stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStats = user.studyHistory.find(h => {
      const hDate = new Date(h.date);
      hDate.setHours(0, 0, 0, 0);
      return hDate.getTime() === today.getTime();
    });

    // Calculate weekly study progress (Mon-Sun)
    // Find Monday of the current week
    const currentDay = today.getDay(); // 0: Sun, 1: Mon, ...
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - distanceToMonday);
    monday.setHours(0, 0, 0, 0);

    const weeklyProgress = [];
    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(monday);
      targetDate.setDate(monday.getDate() + i);

      const stats = user.studyHistory.find(h => {
        const hDate = new Date(h.date);
        hDate.setHours(0, 0, 0, 0);
        return hDate.getTime() === targetDate.getTime();
      });

      weeklyProgress.push({
        dayName: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i], // Mon, Tue... in Vietnamese
        date: targetDate,
        xpEarned: stats ? stats.xpEarned : 0,
        wordsLearned: stats ? stats.wordsLearned : 0,
        studied: !!stats
      });
    }

    const userBadges = await badgeService.getUserBadges(userId);

    return res.json({
      currentStreak: user.currentStreak.count,
      streakFreezes: user.streakFreezes,
      totalXP: user.totalXP,
      availableXP,
      level: Math.floor(user.totalXP / 500) + 1, // Every 500 XP = 1 level
      vocabulary: {
        total: user.vocabulary.length,
        mastered: user.vocabulary.filter(v => v.mastered).length
      },
      todayStudied: !!todayStats,
      badges: userBadges,
      weeklyProgress
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /api/users/streak-freeze/buy
 * Spend 150 XP to buy 1 streak freeze
 */
export async function buyStreakFreeze(req: any, res: Response) {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const availableXP = user.totalXP - user.totalXPSpent;

    if (availableXP < STREAK_FREEZE_COST) {
      return res.status(400).json({
        error: `Bạn cần ${STREAK_FREEZE_COST} XP, hiện tại chỉ có ${availableXP} XP`,
        availableXP,
        needed: STREAK_FREEZE_COST - availableXP
      });
    }

    user.streakFreezes += 1;
    user.totalXPSpent += STREAK_FREEZE_COST;

    await user.save();

    return res.json({
      success: true,
      message: '🎉 Mua Streak Freeze thành công!',
      streakFreezes: user.streakFreezes,
      availableXP: user.totalXP - user.totalXPSpent
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /api/users/streak-freeze/use-manual
 * User manually uses a freeze NOW (Only for emergency)
 */
export async function manualUseStreakFreeze(req: any, res: Response) {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.streakFreezes <= 0) {
      return res.status(400).json({
        error: 'Bạn không có Streak Freeze nào trong kho.'
      });
    }

    user.streakFreezes -= 1;
    user.currentStreak.frozenAt = new Date();

    // Protect streak: set lastStudyDate to today to mark active
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    user.currentStreak.lastStudyDate = today;

    await user.save();

    return res.json({
      success: true,
      message: '✅ Đã kích hoạt Streak Freeze thủ công thành công.',
      streakFreezes: user.streakFreezes,
      currentStreak: user.currentStreak.count
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * PUT /api/users/profile
 * Update user display name or avatar Url
 */
export async function updateProfile(req: any, res: Response) {
  try {
    const userId = req.user.userId;
    const { displayName, avatarUrl } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (displayName) user.displayName = displayName;
    if (avatarUrl) user.avatarUrl = avatarUrl;

    await user.save();

    return res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
