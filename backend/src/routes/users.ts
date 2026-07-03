import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getUserStats,
  buyStreakFreeze,
  manualUseStreakFreeze,
  updateProfile
} from '../controllers/userController';

const router = express.Router();

// Apply auth middleware to all user routes
router.use(authenticateToken);

// Stats
router.get('/stats', getUserStats);

// Profile
router.put('/profile', updateProfile);

// Streak Freezes
router.post('/streak-freeze/buy', buyStreakFreeze);
router.post('/streak-freeze/use-manual', manualUseStreakFreeze);

export default router;
