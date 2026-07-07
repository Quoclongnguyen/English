import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IGrammarOption {
  id: string;
  text: string;
}

export interface IGrammarExercise extends Document {
  topicId: Types.ObjectId;
  type: 'multiple_choice' | 'fill_blank';
  order: number;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  question: string;
  sentence?: string;
  options?: IGrammarOption[];
  correctAnswer: string;
  acceptedAnswers: string[];
  explanation: {
    rule: string;
    correctReason: string;
    commonMistakes: string[];
  };
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const OptionSchema = new Schema<IGrammarOption>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const GrammarExerciseSchema = new Schema<IGrammarExercise>(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'GrammarTopic',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['multiple_choice', 'fill_blank'],
      required: true,
    },
    order: { type: Number, required: true, min: 0 },
    level: {
      type: String,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1'],
      required: true,
    },
    question: { type: String, required: true, trim: true },
    sentence: { type: String, trim: true },
    options: { type: [OptionSchema], default: undefined },
    correctAnswer: { type: String, required: true, trim: true },
    acceptedAnswers: { type: [String], default: [] },
    explanation: {
      rule: { type: String, required: true, trim: true },
      correctReason: { type: String, required: true, trim: true },
      commonMistakes: { type: [String], default: [] },
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

GrammarExerciseSchema.index({ topicId: 1, status: 1, order: 1 }, { unique: true });

export const GrammarExercise = mongoose.model<IGrammarExercise>(
  'GrammarExercise',
  GrammarExerciseSchema
);
