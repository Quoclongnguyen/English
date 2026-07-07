import mongoose from 'mongoose';
import { ReadingExplanationCache } from '../models/ReadingExplanationCache';
import { ReadingPassage } from '../models/ReadingPassage';
import {
  explainReadingSection,
  summarizeReadingPassage,
} from './geminiService';

export class ReadingService {
  async getPublishedPassage(passageId: string) {
    if (!mongoose.isValidObjectId(passageId)) return null;
    const passage = await ReadingPassage.findOne({
      _id: passageId,
      status: 'published',
    }).lean();
    if (!passage) return null;

    return {
      id: passage._id,
      title: passage.title,
      description: passage.description,
      level: passage.level,
      topic: passage.topic,
      thumbnailUrl: passage.thumbnailUrl,
      estimatedReadingMinutes: passage.estimatedReadingMinutes,
      sections: [...passage.sections].sort((a, b) => a.order - b.order),
      hasSummary: Boolean(passage.summary),
    };
  }

  async explainSection(passageId: string, sectionId: string, userLevel: string) {
    const passage = await ReadingPassage.findOne({
      _id: passageId,
      status: 'published',
    });
    if (!passage) throw new Error('PASSAGE_NOT_FOUND');

    const section = passage.sections.find(item => item.id === sectionId);
    if (!section) throw new Error('SECTION_NOT_FOUND');

    const cached = await ReadingExplanationCache.findOne({
      passageId: passage._id,
      sectionId,
      level: userLevel,
    }).lean();
    if (cached) {
      return {
        explanationVi: cached.explanationVi,
        simplifiedEnglish: cached.simplifiedEnglish,
        difficultWords: cached.difficultWords,
        grammarNotes: cached.grammarNotes,
        fromCache: true,
      };
    }

    const generated = await explainReadingSection(section.english, userLevel);
    const saved = await ReadingExplanationCache.findOneAndUpdate(
      { passageId: passage._id, sectionId, level: userLevel },
      { $setOnInsert: generated },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return {
      explanationVi: saved.explanationVi,
      simplifiedEnglish: saved.simplifiedEnglish,
      difficultWords: saved.difficultWords,
      grammarNotes: saved.grammarNotes,
      fromCache: false,
    };
  }

  async getOrGenerateSummary(passageId: string) {
    const passage = await ReadingPassage.findOne({
      _id: passageId,
      status: 'published',
    });
    if (!passage) throw new Error('PASSAGE_NOT_FOUND');

    if (passage.summary) {
      return {
        english: passage.summary.english,
        vietnamese: passage.summary.vietnamese,
        fromCache: true,
      };
    }

    const fullText = [...passage.sections]
      .sort((a, b) => a.order - b.order)
      .map(section => section.english)
      .join('\n\n');
    const generated = await summarizeReadingPassage(fullText, passage.level);

    const updated = await ReadingPassage.findOneAndUpdate(
      { _id: passage._id, summary: { $exists: false } },
      {
        $set: {
          summary: {
            ...generated,
            generatedBy: 'gemini',
            generatedAt: new Date(),
          },
        },
      },
      { new: true }
    );
    const summary = updated?.summary || (await ReadingPassage.findById(passage._id))?.summary;
    if (!summary) throw new Error('SUMMARY_SAVE_FAILED');

    return { english: summary.english, vietnamese: summary.vietnamese, fromCache: false };
  }
}
