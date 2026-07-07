import mongoose from 'mongoose';
import { AudioTrack } from '../models/AudioTrack';
import { Lesson } from '../models/Lesson';
import { User } from '../models/User';
import { UserWordProgress } from '../models/UserWordProgress';
import { Word } from '../models/Word';

export class ListeningService {
  async getPublishedLesson(lessonId: string) {
    if (!mongoose.isValidObjectId(lessonId)) return null;

    const lesson = await Lesson.findOne({
      _id: lessonId,
      type: 'listening',
      status: 'published',
    }).lean();
    if (!lesson) return null;

    const audioTrack = await AudioTrack.findById(lesson.audioTrackId).lean();
    if (!audioTrack) return null;

    return {
      id: lesson._id,
      title: lesson.title,
      description: lesson.description,
      level: lesson.level,
      topic: lesson.topic,
      thumbnailUrl: lesson.thumbnailUrl,
      durationMs: lesson.durationMs,
      audioUrl: audioTrack.audioUrl,
      transcript: audioTrack.transcript,
    };
  }

  async saveTranscriptWord(
    userId: string,
    lessonId: string,
    segmentId: string,
    transcriptWordId: string
  ) {
    const lesson = await Lesson.findOne({
      _id: lessonId,
      type: 'listening',
      status: 'published',
    });
    if (!lesson) throw new Error('LESSON_NOT_FOUND');

    const audioTrack = await AudioTrack.findById(lesson.audioTrackId);
    if (!audioTrack) throw new Error('AUDIO_TRACK_NOT_FOUND');

    const segment = audioTrack.transcript.find(item => item.id === segmentId);
    const transcriptWord = segment?.words.find(item => item.id === transcriptWordId);
    if (!segment || !transcriptWord) throw new Error('TRANSCRIPT_WORD_NOT_FOUND');
    if (!transcriptWord.isSaveable) throw new Error('WORD_NOT_SAVEABLE');

    const normalizedWord = transcriptWord.normalizedText.toLowerCase().trim();
    if (!normalizedWord || !transcriptWord.meaningVi) {
      throw new Error('WORD_DETAILS_INCOMPLETE');
    }

    const user = await User.findById(userId);
    if (!user) throw new Error('USER_NOT_FOUND');

    let word = await Word.findOne({ word: normalizedWord });
    if (!word) {
      word = await Word.create({
        word: normalizedWord,
        phonetic: transcriptWord.phonetic || '',
        type: transcriptWord.type || 'unknown',
        meaning_vi: transcriptWord.meaningVi,
        example: transcriptWord.example || segment.text,
        topic: lesson.topic,
        level: lesson.level,
        source: 'listening',
        lessonRef: lesson._id,
      });
    }

    const existingVocab = user.vocabulary.find(
      item => item.word.toLowerCase() === normalizedWord
    );
    const alreadySaved = Boolean(existingVocab);

    if (!existingVocab) {
      user.vocabulary.push({
        word: normalizedWord,
        source: 'listening',
        learnedAt: new Date(),
        mastered: false,
        reviewCount: 0,
      });
      await user.save();
    }

    const progress = await UserWordProgress.findOneAndUpdate(
      { userId, wordId: word._id },
      {
        $setOnInsert: {
          status: 'learning',
          nextReviewDate: new Date(),
          reviewCount: 0,
          easeFactor: 2.5,
          interval: 0,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return { word, progress, alreadySaved };
  }
}
