import mongoose, { Document, Schema } from 'mongoose';

export interface ITranscriptWord {
  id: string;
  text: string;
  normalizedText: string;
  startMs: number;
  endMs: number;
  isSaveable: boolean;
  phonetic?: string;
  type?: string;
  meaningVi?: string;
  example?: string;
}

export interface ITranscriptSegment {
  id: string;
  text: string;
  translationVi?: string;
  startMs: number;
  endMs: number;
  words: ITranscriptWord[];
}

export interface IAudioTrack extends Document {
  audioUrl: string;
  source: 'upload' | 'gemini_tts' | 'third_party';
  provider?: string;
  durationMs: number;
  transcript: ITranscriptSegment[];
  createdAt: Date;
  updatedAt: Date;
}

const TranscriptWordSchema = new Schema<ITranscriptWord>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true, trim: true },
    normalizedText: { type: String, required: true, lowercase: true, trim: true },
    startMs: { type: Number, required: true, min: 0 },
    endMs: { type: Number, required: true, min: 0 },
    isSaveable: { type: Boolean, default: true },
    phonetic: { type: String, trim: true },
    type: { type: String, trim: true },
    meaningVi: { type: String, trim: true },
    example: { type: String, trim: true },
  },
  { _id: false }
);

const TranscriptSegmentSchema = new Schema<ITranscriptSegment>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true, trim: true },
    translationVi: { type: String, trim: true },
    startMs: { type: Number, required: true, min: 0 },
    endMs: { type: Number, required: true, min: 0 },
    words: { type: [TranscriptWordSchema], required: true },
  },
  { _id: false }
);

const AudioTrackSchema = new Schema<IAudioTrack>(
  {
    audioUrl: { type: String, required: true, trim: true },
    source: {
      type: String,
      enum: ['upload', 'gemini_tts', 'third_party'],
      default: 'upload',
    },
    provider: { type: String, trim: true },
    durationMs: { type: Number, required: true, min: 1 },
    transcript: { type: [TranscriptSegmentSchema], required: true },
  },
  { timestamps: true }
);

export const AudioTrack = mongoose.model<IAudioTrack>('AudioTrack', AudioTrackSchema);
