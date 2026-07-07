import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { GoogleGenAI, Modality } from '@google/genai';
import { v2 as cloudinary } from 'cloudinary';
import { AudioTrack } from '../models/AudioTrack';
import { Lesson } from '../models/Lesson';

interface SeedWord {
  startMs: number;
  endMs: number;
}

interface SeedSegment {
  text: string;
  startMs: number;
  endMs: number;
  words: SeedWord[];
}

interface ListeningSeed {
  lesson: {
    title: string;
    durationMs: number;
  };
  audioTrack: {
    audioUrl: string;
    source: string;
    provider?: string;
    durationMs: number;
    transcript: SeedSegment[];
  };
}

const SAMPLE_RATE = 24000;
const CHANNELS = 1;
const BITS_PER_SAMPLE = 16;

const createWaveBuffer = (pcm: Buffer) => {
  const header = Buffer.alloc(44);
  const byteRate = (SAMPLE_RATE * CHANNELS * BITS_PER_SAMPLE) / 8;
  const blockAlign = (CHANNELS * BITS_PER_SAMPLE) / 8;

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(CHANNELS, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(BITS_PER_SAMPLE, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]);
};

const scaleTranscript = (
  transcript: SeedSegment[],
  oldDurationMs: number,
  newDurationMs: number
) => {
  const ratio = newDurationMs / oldDurationMs;
  return transcript.map(segment => ({
    ...segment,
    startMs: Math.round(segment.startMs * ratio),
    endMs: Math.round(segment.endMs * ratio),
    words: segment.words.map(word => ({
      ...word,
      startMs: Math.round(word.startMs * ratio),
      endMs: Math.round(word.endMs * ratio),
    })),
  }));
};

const uploadAudio = async (wave: Buffer, fileName: string): Promise<string> => {
  const hasCloudinary =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (hasCloudinary) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'lexis/listening',
          public_id: path.parse(fileName).name,
          overwrite: true,
        },
        (error, uploadResult) => {
          if (error || !uploadResult) reject(error || new Error('Cloudinary upload failed'));
          else resolve(uploadResult);
        }
      );
      stream.end(wave);
    });
    return result.secure_url;
  }

  const uploadsDir = path.join(__dirname, '../../public/uploads');
  await fs.promises.mkdir(uploadsDir, { recursive: true });
  await fs.promises.writeFile(path.join(uploadsDir, fileName), wave);
  return `/uploads/${fileName}`;
};

const generate = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  const mongoUri = process.env.MONGODB_URI;
  if (!apiKey) throw new Error('GEMINI_API_KEY is required');
  if (!mongoUri) throw new Error('MONGODB_URI is required');

  const seedPath = path.join(__dirname, '../seeds/listening.sample.json');
  const seed = JSON.parse(await fs.promises.readFile(seedPath, 'utf8')) as ListeningSeed;
  const transcript = seed.audioTrack.transcript.map(segment => segment.text).join(' ');

  const client = new GoogleGenAI({ apiKey });
  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash-preview-tts',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Read the following English learning passage clearly at a calm,
natural A2 learner pace. Use a warm neutral American accent. Read exactly the passage
without adding commentary:\n\n${transcript}`,
          },
        ],
      },
    ],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!audioData) throw new Error('Gemini did not return audio data');

  const pcm = Buffer.from(audioData, 'base64');
  const wave = createWaveBuffer(pcm);
  const durationMs = Math.round((pcm.length / (SAMPLE_RATE * CHANNELS * 2)) * 1000);
  const fileName = `listening-${seed.lesson.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.wav`;
  const audioUrl = await uploadAudio(wave, fileName);
  const scaledTranscript = scaleTranscript(
    seed.audioTrack.transcript,
    seed.audioTrack.durationMs,
    durationMs
  );

  seed.lesson.durationMs = durationMs;
  seed.audioTrack = {
    ...seed.audioTrack,
    audioUrl,
    source: 'gemini_tts',
    provider: 'gemini-2.5-flash-preview-tts',
    durationMs,
    transcript: scaledTranscript,
  };
  await fs.promises.writeFile(seedPath, `${JSON.stringify(seed, null, 2)}\n`, 'utf8');

  await mongoose.connect(mongoUri);
  const lesson = await Lesson.findOne({ type: 'listening', title: seed.lesson.title });
  if (!lesson) throw new Error('Seeded listening lesson was not found');

  await AudioTrack.findByIdAndUpdate(lesson.audioTrackId, seed.audioTrack, {
    runValidators: true,
  });
  lesson.durationMs = durationMs;
  await lesson.save();

  console.log(`Generated ${durationMs}ms audio: ${audioUrl}`);
};

generate()
  .catch(error => {
    console.error('Unable to generate listening audio:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
