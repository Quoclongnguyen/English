import { Router } from 'express';
import {
  getGrammarExercises,
  getGrammarTopic,
  submitGrammarAnswer,
} from '../controllers/grammarController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);

router.get('/topics/:topicId', getGrammarTopic);
router.get('/topics/:topicId/exercises', getGrammarExercises);
router.post('/exercises/:exerciseId/submit', submitGrammarAnswer);

export default router;
