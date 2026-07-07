import { Response } from 'express';
import { AuthRequest } from '../types';
import { GrammarService } from '../services/grammarService';

const grammarService = new GrammarService();

const handleError = (error: unknown, res: Response) => {
  const code = error instanceof Error ? error.message : '';
  const status =
    code === 'EXERCISE_NOT_FOUND'
      ? 404
      : code === 'INVALID_ANSWER' || code === 'INVALID_OPTION'
        ? 400
        : 500;
  if (status === 500) console.error('Grammar API error:', error);
  res.status(status).json({ message: code || 'Grammar request failed' });
};

export const getGrammarTopic = async (req: AuthRequest, res: Response) => {
  try {
    const topic = await grammarService.getPublishedTopic(String(req.params.topicId));
    if (!topic) {
      res.status(404).json({ message: 'Grammar topic not found' });
      return;
    }
    res.json({ topic });
  } catch (error) {
    handleError(error, res);
  }
};

export const listGrammarTopics = async (_req: AuthRequest, res: Response) => {
  try {
    const topics = await grammarService.listPublishedTopics();
    res.json({ topics });
  } catch (error) {
    handleError(error, res);
  }
};

export const getGrammarExercises = async (req: AuthRequest, res: Response) => {
  try {
    const exercises = await grammarService.getPublishedExercises(
      String(req.params.topicId)
    );
    if (!exercises) {
      res.status(404).json({ message: 'Grammar topic not found' });
      return;
    }
    res.json({ exercises });
  } catch (error) {
    handleError(error, res);
  }
};

export const submitGrammarAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { answer } = req.body;
    if (typeof answer !== 'string') {
      res.status(400).json({ message: 'answer is required' });
      return;
    }
    const result = await grammarService.submitAnswer(
      String(req.params.exerciseId),
      answer
    );
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
};
