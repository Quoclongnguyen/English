import { Router } from 'express';
import { savePlacementResult } from '../controllers/onboardingController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/placement-result', authenticateToken, savePlacementResult);

export default router;
