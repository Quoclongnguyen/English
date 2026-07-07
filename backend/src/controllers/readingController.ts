import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../types';
import { User } from '../models/User';
import { ReadingService } from '../services/readingService';

const readingService = new ReadingService();

const handleError = (error: unknown, res: Response) => {
  const code = error instanceof Error ? error.message : '';
  const status =
    code === 'PASSAGE_NOT_FOUND' ? 404 : code === 'SECTION_NOT_FOUND' ? 400 : 500;
  if (status === 500) console.error('Reading API error:', error);
  res.status(status).json({ message: code || 'Reading request failed' });
};

export const getReadingPassage = async (req: AuthRequest, res: Response) => {
  try {
    const passage = await readingService.getPublishedPassage(String(req.params.passageId));
    if (!passage) {
      res.status(404).json({ message: 'Reading passage not found' });
      return;
    }
    res.json({ passage });
  } catch (error) {
    handleError(error, res);
  }
};

export const explainReadingPassageSection = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const passageId = String(req.params.passageId);
    const { sectionId } = req.body;
    if (!mongoose.isValidObjectId(passageId) || typeof sectionId !== 'string') {
      res.status(400).json({ message: 'A valid passageId and sectionId are required' });
      return;
    }

    const user = await User.findById(req.user?.userId).select('level').lean();
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const explanation = await readingService.explainSection(
      passageId,
      sectionId,
      user.level
    );
    res.json(explanation);
  } catch (error) {
    handleError(error, res);
  }
};

export const getReadingSummary = async (req: AuthRequest, res: Response) => {
  try {
    const passageId = String(req.params.passageId);
    if (!mongoose.isValidObjectId(passageId)) {
      res.status(400).json({ message: 'Invalid passageId' });
      return;
    }
    const summary = await readingService.getOrGenerateSummary(passageId);
    res.json(summary);
  } catch (error) {
    handleError(error, res);
  }
};
