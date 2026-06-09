import { Response } from 'express';
import { User } from '../models';
import { AuthRequest, PlacementResultBody } from '../types';

const VALID_GOALS = ['ielts', 'toeic', 'business', 'daily'];
const VALID_DAILY_TARGETS = [5, 7, 10];
const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2'];

export const savePlacementResult = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { goal, dailyTarget, level } = req.body as PlacementResultBody;

    if (!VALID_GOALS.includes(goal)) {
      res.status(400).json({ message: 'Invalid learning goal' });
      return;
    }

    if (!VALID_DAILY_TARGETS.includes(dailyTarget)) {
      res.status(400).json({ message: 'Invalid daily target' });
      return;
    }

    if (!VALID_LEVELS.includes(level)) {
      res.status(400).json({ message: 'Invalid placement level' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      { goal, dailyTarget, level },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        goal: user.goal,
        dailyTarget: user.dailyTarget,
        xp: user.xp,
        streak: user.streak,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('[savePlacementResult]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
