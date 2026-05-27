import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AuthRequest, RegisterBody, LoginBody } from '../types';

const SALT_ROUNDS = 12;



export const register = async (req: Request<{}, {}, RegisterBody>, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email and password are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ message: 'Email already in use' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, passwordHash });

    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());

    res.status(201).json({
      accessToken,
      refreshToken,
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
    console.error('[register]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login 

export const login = async (req: Request<{}, {}, LoginBody>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());

    res.status(200).json({
      accessToken,
      refreshToken,
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
    console.error('[login]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//Refresh Token

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token required' });
      return;
    }

    const payload = verifyRefreshToken(refreshToken);
    const newAccessToken = signAccessToken(payload.userId);
    const newRefreshToken = signRefreshToken(payload.userId);

    res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};


export const logout = (_req: Request, res: Response): void => {
  // Stateless JWT: client xóa token local là đủ
  res.status(200).json({ message: 'Logged out successfully' });
};



export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select('-passwordHash');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('[getMe]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
