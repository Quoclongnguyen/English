import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IDetectedWord {
  word: string;
  phonetic: string;
  meaning_vi: string;
  example: string;
}

export interface IPhotoScan extends Document {
  userId: Types.ObjectId;
  photoUrl: string;
  story: string;
  detectedWords: IDetectedWord[];
  savedWords: string[];
  xpEarned: number;
  createdAt: Date;
  updatedAt: Date;
}

const DetectedWordSchema = new Schema({
  word: { type: String, required: true },
  phonetic: { type: String, required: true },
  meaning_vi: { type: String, required: true },
  example: { type: String, required: true }
});

const PhotoScanSchema = new Schema<IPhotoScan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    photoUrl: { type: String, required: true },
    story: { type: String, required: true },
    detectedWords: [DetectedWordSchema],
    savedWords: [{ type: String, lowercase: true, trim: true }],
    xpEarned: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const PhotoScan = mongoose.model<IPhotoScan>('PhotoScan', PhotoScanSchema);
