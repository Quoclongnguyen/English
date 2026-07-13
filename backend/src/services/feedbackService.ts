import mongoose from 'mongoose';
import { Feedback, FeedbackModule } from '../models/Feedback';

interface CreateFeedbackInput {
  userId: string;
  module: FeedbackModule;
  rating: number;
  message: string;
  platform?: string;
  appVersion?: string;
  deviceModel?: string;
}

const allowedModules: FeedbackModule[] = [
  'general',
  'vocabulary',
  'camera',
  'listening',
  'reading',
  'grammar',
];

const cleanOptional = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

export class FeedbackService {
  async createFeedback(input: CreateFeedbackInput) {
    if (!mongoose.isValidObjectId(input.userId)) {
      throw new Error('INVALID_USER');
    }
    if (!allowedModules.includes(input.module)) {
      throw new Error('INVALID_MODULE');
    }
    if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
      throw new Error('INVALID_RATING');
    }

    const message = input.message.trim();
    if (!message || message.length > 2000) {
      throw new Error('INVALID_MESSAGE');
    }

    const feedback = await Feedback.create({
      userId: input.userId,
      module: input.module,
      rating: input.rating,
      message,
      platform: cleanOptional(input.platform),
      appVersion: cleanOptional(input.appVersion),
      deviceModel: cleanOptional(input.deviceModel),
    });

    return {
      id: feedback._id,
      module: feedback.module,
      rating: feedback.rating,
      message: feedback.message,
      status: feedback.status,
      createdAt: feedback.createdAt,
    };
  }

  async listMyFeedback(userId: string) {
    if (!mongoose.isValidObjectId(userId)) {
      throw new Error('INVALID_USER');
    }

    const feedback = await Feedback.find({ userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return feedback.map(item => ({
      id: item._id,
      module: item.module,
      rating: item.rating,
      message: item.message,
      status: item.status,
      createdAt: item.createdAt,
    }));
  }
}
