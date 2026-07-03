import { Router } from 'express';
import {
  getDailyWords,
  getVocabBank,
  getReviewQueue,
  updateProgress,
  scanCameraPhoto,
  saveCameraWords,
  getPhotoDeck
} from '../controllers/wordController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/daily', getDailyWords);
router.get('/bank', getVocabBank);
router.get('/review', getReviewQueue);
router.post('/progress', updateProgress);

// Camera Scan Routes
router.post('/camera-scan', scanCameraPhoto);
router.post('/camera', saveCameraWords);
router.get('/photo-deck', getPhotoDeck);

export default router;
