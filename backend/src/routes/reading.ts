import { Router } from 'express';
import {
  explainReadingPassageSection,
  getReadingPassage,
  getReadingSummary,
} from '../controllers/readingController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);

router.get('/passages/:passageId', getReadingPassage);
router.post('/passages/:passageId/explain', explainReadingPassageSection);
router.post('/passages/:passageId/summary', getReadingSummary);

export default router;
