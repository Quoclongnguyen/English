import { Router } from 'express';
import {
  getListeningLesson,
  saveListeningWord,
} from '../controllers/listeningController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.get('/lessons/:lessonId', getListeningLesson);
router.post('/lessons/:lessonId/words', saveListeningWord);

export default router;
