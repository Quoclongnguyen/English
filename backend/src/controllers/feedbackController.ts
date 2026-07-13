import { Response } from 'express';
import { AuthRequest } from '../types';
import { FeedbackService } from '../services/feedbackService';

const feedbackService = new FeedbackService();

const handleFeedbackError = (error: unknown, res: Response) => {
  const code = error instanceof Error ? error.message : '';
  const status = [
    'INVALID_USER',
    'INVALID_MODULE',
    'INVALID_RATING',
    'INVALID_MESSAGE',
  ].includes(code)
    ? 400
    : 500;

  if (status === 500) console.error('Feedback API error:', error);
  res.status(status).json({ message: code || 'Feedback request failed' });
};

export const createFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const feedback = await feedbackService.createFeedback({
      userId,
      module: req.body.module,
      rating: req.body.rating,
      message: req.body.message,
      platform: req.body.platform,
      appVersion: req.body.appVersion,
      deviceModel: req.body.deviceModel,
    });

    res.status(201).json({ feedback });
  } catch (error) {
    handleFeedbackError(error, res);
  }
};

export const listMyFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const feedback = await feedbackService.listMyFeedback(userId);
    res.json({ feedback });
  } catch (error) {
    handleFeedbackError(error, res);
  }
};
