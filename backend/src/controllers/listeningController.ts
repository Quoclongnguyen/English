import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../types';
import { ListeningService } from '../services/listeningService';

const listeningService = new ListeningService();

export const getListeningLesson = async (req: AuthRequest, res: Response) => {
  try {
    const lessonId = String(req.params.lessonId);
    const lesson = await listeningService.getPublishedLesson(lessonId);
    if (!lesson) {
      res.status(404).json({ message: 'Listening lesson not found' });
      return;
    }
    res.json({ lesson });
  } catch (error) {
    console.error('Get listening lesson error:', error);
    res.status(500).json({ message: 'Unable to load listening lesson' });
  }
};

export const saveListeningWord = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const lessonId = String(req.params.lessonId);
    const { segmentId, wordId } = req.body;

    if (!userId || !mongoose.isValidObjectId(lessonId)) {
      res.status(400).json({ message: 'Invalid request' });
      return;
    }
    if (typeof segmentId !== 'string' || typeof wordId !== 'string') {
      res.status(400).json({ message: 'segmentId and wordId are required' });
      return;
    }

    const result = await listeningService.saveTranscriptWord(
      userId,
      lessonId,
      segmentId,
      wordId
    );
    res.json(result);
  } catch (error) {
    const code = error instanceof Error ? error.message : '';
    const status =
      code === 'LESSON_NOT_FOUND' || code === 'AUDIO_TRACK_NOT_FOUND'
        ? 404
        : code === 'USER_NOT_FOUND'
          ? 404
          : code.startsWith('TRANSCRIPT_') ||
              code === 'WORD_NOT_SAVEABLE' ||
              code === 'WORD_DETAILS_INCOMPLETE'
            ? 400
            : 500;
    if (status === 500) console.error('Save listening word error:', error);
    res.status(status).json({ message: code || 'Unable to save word' });
  }
};
