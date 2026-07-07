import mongoose from 'mongoose';
import { GrammarExercise } from '../models/GrammarExercise';
import { GrammarTopic } from '../models/GrammarTopic';

const normalizeAnswer = (answer: string) =>
  answer.trim().toLowerCase().replace(/\s+/g, ' ');

export class GrammarService {
  async getPublishedTopic(topicId: string) {
    if (!mongoose.isValidObjectId(topicId)) return null;

    const topic = await GrammarTopic.findOne({
      _id: topicId,
      status: 'published',
    }).lean();
    if (!topic) return null;

    const exerciseCount = await GrammarExercise.countDocuments({
      topicId: topic._id,
      status: 'published',
    });

    return {
      id: topic._id,
      title: topic.title,
      slug: topic.slug,
      description: topic.description,
      level: topic.level,
      category: topic.category,
      order: topic.order,
      theory: topic.theory,
      exerciseCount,
    };
  }

  async getPublishedExercises(topicId: string) {
    if (!mongoose.isValidObjectId(topicId)) return null;

    const topic = await GrammarTopic.exists({
      _id: topicId,
      status: 'published',
    });
    if (!topic) return null;

    const exercises = await GrammarExercise.find({
      topicId,
      status: 'published',
    })
      .sort({ order: 1 })
      .lean();

    return exercises.map(exercise => ({
      id: exercise._id,
      topicId: exercise.topicId,
      type: exercise.type,
      order: exercise.order,
      level: exercise.level,
      question: exercise.question,
      sentence: exercise.sentence,
      options: exercise.options,
    }));
  }

  async submitAnswer(exerciseId: string, submittedAnswer: string) {
    if (!mongoose.isValidObjectId(exerciseId)) throw new Error('EXERCISE_NOT_FOUND');

    const exercise = await GrammarExercise.findOne({
      _id: exerciseId,
      status: 'published',
    }).lean();
    if (!exercise) throw new Error('EXERCISE_NOT_FOUND');

    const normalizedSubmitted = normalizeAnswer(submittedAnswer);
    if (!normalizedSubmitted || normalizedSubmitted.length > 200) {
      throw new Error('INVALID_ANSWER');
    }

    let isCorrect = false;
    let submittedAnswerText = submittedAnswer.trim();
    let correctAnswerText = exercise.correctAnswer;

    if (exercise.type === 'multiple_choice') {
      const selectedOption = exercise.options?.find(
        option => normalizeAnswer(option.id) === normalizedSubmitted
      );
      if (!selectedOption) throw new Error('INVALID_OPTION');

      const correctOption = exercise.options?.find(
        option => option.id === exercise.correctAnswer
      );
      if (!correctOption) throw new Error('EXERCISE_CONFIGURATION_ERROR');

      isCorrect = selectedOption.id === exercise.correctAnswer;
      submittedAnswerText = selectedOption.text;
      correctAnswerText = correctOption.text;
    } else {
      const acceptedAnswers = new Set(
        [exercise.correctAnswer, ...exercise.acceptedAnswers].map(normalizeAnswer)
      );
      isCorrect = acceptedAnswers.has(normalizedSubmitted);
    }

    return {
      exerciseId: exercise._id,
      isCorrect,
      submittedAnswer: submittedAnswerText,
      correctAnswer: exercise.correctAnswer,
      correctAnswerText,
      explanation: {
        rule: exercise.explanation.rule,
        correctReason: exercise.explanation.correctReason,
        mistakeReason: isCorrect
          ? undefined
          : exercise.explanation.commonMistakes[0] ||
            'Đáp án chưa áp dụng đúng quy tắc của chủ điểm này.',
      },
    };
  }
}
