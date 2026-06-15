import { Router } from 'express';
import { getDailyWords, getVocabBank, getReviewQueue, updateProgress } from '../controllers/wordController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/daily', getDailyWords);
router.get('/bank', getVocabBank);
router.get('/review', getReviewQueue);
router.post('/progress', updateProgress);

export default router;
