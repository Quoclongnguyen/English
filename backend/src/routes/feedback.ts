import { Router } from 'express';
import { createFeedback, listMyFeedback } from '../controllers/feedbackController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.post('/', createFeedback);
router.get('/my', listMyFeedback);

export default router;
