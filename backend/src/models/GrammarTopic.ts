import mongoose, { Document, Schema } from 'mongoose';

export interface IGrammarExample {
  english: string;
  vietnamese: string;
}

export interface IGrammarUsage {
  id: string;
  title: string;
  explanation: string;
  examples: IGrammarExample[];
}

export interface IGrammarStructure {
  id: string;
  label: 'affirmative' | 'negative' | 'question' | 'other';
  formula: string;
  explanation?: string;
  examples: IGrammarExample[];
}

export interface IGrammarTopic extends Document {
  title: string;
  slug: string;
  description?: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  category: 'tense' | 'modal' | 'conditional' | 'comparison' | 'other';
  order: number;
  theory: {
    overview: string;
    usages: IGrammarUsage[];
    structures: IGrammarStructure[];
    notes: string[];
  };
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const ExampleSchema = new Schema<IGrammarExample>(
  {
    english: { type: String, required: true, trim: true },
    vietnamese: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const UsageSchema = new Schema<IGrammarUsage>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    explanation: { type: String, required: true, trim: true },
    examples: { type: [ExampleSchema], default: [] },
  },
  { _id: false }
);

const StructureSchema = new Schema<IGrammarStructure>(
  {
    id: { type: String, required: true },
    label: {
      type: String,
      enum: ['affirmative', 'negative', 'question', 'other'],
      required: true,
    },
    formula: { type: String, required: true, trim: true },
    explanation: { type: String, trim: true },
    examples: { type: [ExampleSchema], default: [] },
  },
  { _id: false }
);

const GrammarTopicSchema = new Schema<IGrammarTopic>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    level: {
      type: String,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1'],
      required: true,
    },
    category: {
      type: String,
      enum: ['tense', 'modal', 'conditional', 'comparison', 'other'],
      required: true,
    },
    order: { type: Number, required: true, min: 0 },
    theory: {
      overview: { type: String, required: true, trim: true },
      usages: { type: [UsageSchema], default: [] },
      structures: { type: [StructureSchema], default: [] },
      notes: { type: [String], default: [] },
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

GrammarTopicSchema.index({ level: 1, category: 1, status: 1, order: 1 });

export const GrammarTopic = mongoose.model<IGrammarTopic>(
  'GrammarTopic',
  GrammarTopicSchema
);
