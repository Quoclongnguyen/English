import { GoogleGenerativeAI, Schema, SchemaType } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
export interface DailyWordParams {
  level: string;
  goal: string;
  count: number;
  learnedWords: string[];
}

export interface GeneratedWord {
  word: string;
  phonetic: string;
  type: string;
  meaning_vi: string;
  example: string;
}

export interface DailyVocabResult {
  words: GeneratedWord[];
  story: string;
}

const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    words: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          word: { type: SchemaType.STRING },
          phonetic: { type: SchemaType.STRING },
          type: { type: SchemaType.STRING },
          meaning_vi: { type: SchemaType.STRING },
          example: { type: SchemaType.STRING },
        },
        required: ["word", "phonetic", "type", "meaning_vi", "example"],
      },
    },
    story: { type: SchemaType.STRING },
  },
  required: ["words", "story"],
};

export const generateDailyVocab = async (params: DailyWordParams, retries = 3): Promise<DailyVocabResult> => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.7,
    },
  });

  const prompt = `Bạn là giáo viên tiếng Anh.
User: level=${params.level}, goal=${params.goal}, daily_target=${params.count} từ.
Từ đã học (không lặp lại): ${params.learnedWords.join(', ') || 'Chưa có'}.

Tạo ${params.count} từ vựng phù hợp:
- Đúng trình độ ${params.level}, không vượt quá 1 bậc.
- Liên quan đến ${params.goal}.
- Mỗi từ: word, IPA, type, meaning_vi, example.
- 1 mini-story 4-5 câu dùng HẾT các từ trên, bối cảnh ${params.goal}.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text) as DailyVocabResult;
  } catch (error: any) {
    if (error.status === 429 && retries > 0) {
      await delay(40000); // đợi 40 giây
      return generateDailyVocab(params, retries - 1);
    }
    throw new Error("Failed to parse Gemini response");
  }
};
