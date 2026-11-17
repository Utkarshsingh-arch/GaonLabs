import {
  TopicDetail,
  TopicSummary,
  TopicLesson,
  TopicVideoMeta,
  TopicOfficialResource,
} from './topic.types';
import { TOPIC_SUMMARIES, TOPIC_LESSONS } from './topic.data';
import { prisma } from '../../shared/database/prisma';

export interface TopicQueryFilters {
  boardId?: string;
  grade?: number;
  subjectId?: string;
  medium?: string;
  academicYear?: string;
}

export class TopicService {
  /**
   * List topics based on student filters (board, grade, subject, medium).
   * Allows exploring other grades without changing the student's official enrollment.
   */
  async listTopics(filters: TopicQueryFilters): Promise<TopicSummary[]> {
    let results = [...TOPIC_SUMMARIES];

    if (filters.grade !== undefined && !isNaN(filters.grade)) {
      results = results.filter((t) => t.grade === Number(filters.grade));
    }

    if (filters.boardId) {
      const b = filters.boardId.toUpperCase();
      results = results.filter((t) => t.boardId.toUpperCase() === b || t.boardId === 'ALL');
    }

    if (filters.subjectId) {
      const s = filters.subjectId.toUpperCase();
      results = results.filter(
        (t) =>
          t.subjectId.toUpperCase() === s ||
          t.subjectName.toUpperCase() === s ||
          t.stemPillar.toUpperCase() === s
      );
    }

    if (filters.medium) {
      const m = filters.medium.toLowerCase();
      results = results.filter((t) => t.medium.toLowerCase() === m);
    }

    return results;
  }

  /**
   * Get complete topic detail by topicId.
   */
  async getTopicById(topicId: string): Promise<TopicDetail | null> {
    const topic = TOPIC_SUMMARIES.find((t) => t.topicId === topicId);
    if (!topic) return null;

    // Dynamically enrich official resources from DB if chapterId is present and DB connected
    if (topic.relatedChapterId) {
      try {
        const chapter = await prisma.chapter.findUnique({
          where: { id: topic.relatedChapterId },
          include: {
            textbookEdition: {
              include: { textbook: { include: { publisher: true } } },
            },
          },
        });

        if (chapter && topic.officialResources) {
          topic.officialResources.chapterNumber = chapter.chapterNumber;
          topic.officialResources.chapterTitle = chapter.title;
          topic.officialResources.textbookTitle = chapter.textbookEdition.titleInLanguage || chapter.textbookEdition.textbook.canonicalTitle;
          topic.officialResources.publisher = chapter.textbookEdition.textbook.publisher.name;
          if (chapter.sourceUrl) {
            topic.officialResources.officialSourceUrl = chapter.sourceUrl;
          }
        }
      } catch (err) {
        // Fallback to static data if database is unavailable
      }
    }

    return topic;
  }

  /**
   * Get in-app lesson reading content.
   */
  async getTopicLesson(topicId: string, language?: string): Promise<TopicLesson | null> {
    const lesson = TOPIC_LESSONS[topicId];
    if (lesson) {
      if (language && lesson.language.toLowerCase() !== language.toLowerCase()) {
        // If specific language requested and lesson doesn't match
        // Return lesson if it's the only one, or null if strictly requested
      }
      return lesson;
    }

    // If not found in detailed dictionary, generate fallback from summary if topic exists
    const summary = TOPIC_SUMMARIES.find((t) => t.topicId === topicId);
    if (!summary) return null;

    return {
      topicId: summary.topicId,
      title: summary.title,
      grade: summary.grade,
      subject: summary.subjectName,
      language: summary.medium,
      topicIntroduction: `${summary.title} introduces foundational scientific principles for Class ${summary.grade} ${summary.subjectName}.`,
      simpleExplanation: summary.shortDescription,
      scientificPrinciples: [
        {
          title: summary.title,
          statement: `Key theoretical concepts and rules for Class ${summary.grade} ${summary.subjectName}.`,
          explanation: summary.lessonOverview || summary.shortDescription,
        },
      ],
      examples: [
        {
          title: `Everyday Application of ${summary.title}`,
          description: `Practical examples observed in household, agricultural, and technological contexts.`,
          context: 'General Observation',
        },
      ],
      diagrams: [],
      realWorldApplications: [
        {
          title: 'Field & Rural Technology',
          description: `How ${summary.title} connects to tools and natural phenomena in village life.`,
        },
      ],
      importantTakeaways: [
        `Understand the fundamental definition of ${summary.title}.`,
        `Relate ${summary.title} to real-world observations and textbook exercises.`,
      ],
      glossary: [
        {
          term: summary.title,
          definition: summary.shortDescription,
        },
      ],
    };
  }

  /**
   * Get video metadata for a topic.
   * If a specific language is requested, ensures the video matches that language.
   * Does NOT silently fall back to English when Kannada is requested.
   */
  async getTopicVideo(topicId: string, language?: string): Promise<TopicVideoMeta | null> {
    const topic = TOPIC_SUMMARIES.find((t) => t.topicId === topicId);
    if (!topic || !topic.videoMeta) return null;
    if (language && topic.videoMeta.language.toLowerCase() !== language.toLowerCase()) {
      return null;
    }
    return topic.videoMeta;
  }

  /**
   * Get official resources for a topic.
   */
  async getTopicResources(topicId: string): Promise<TopicOfficialResource[]> {
    const topic = TOPIC_SUMMARIES.find((t) => t.topicId === topicId);
    if (!topic || !topic.officialResources) return [];
    return [topic.officialResources];
  }

  /**
   * Match student text selection or document context to a relevant topic.
   * Used by the Smart Reader's Explain action.
   * Supports both English and Kannada curricula and keywords.
   */
  async matchTopicByTextOrChapter(params: {
    selectedText: string;
    chapterId?: string;
    documentId?: string;
    grade?: number;
    medium?: string;
  }): Promise<{ topic: TopicDetail; lesson: TopicLesson; video?: TopicVideoMeta } | null> {
    const textLower = params.selectedText.toLowerCase();

    // -------------------------------------------------------------------------
    // A. Kannada (KTBS) Curriculum Matches
    // -------------------------------------------------------------------------

    // 1. KTBS Class 7 Science: Heat (ಉಷ್ಣ ಮತ್ತು ತಾಪಮಾನ ವರ್ಗಾವಣೆ)
    if (
      params.chapterId === 'ad794275-7405-4039-8276-7db15c6ee237' ||
      params.documentId === 'doc-ktbs-heat-cl7' ||
      textLower.includes('ಉಷ್ಣ') ||
      textLower.includes('ತಾಪಮಾನ') ||
      textLower.includes('ವಹನ') ||
      textLower.includes('ಸಂವಹನ') ||
      textLower.includes('ವಿಕಿರಣ') ||
      textLower.includes('ತಾಪಮಾಪಕ') ||
      (textLower.includes('heat') && (params.grade === 7 || params.medium === 'kn'))
    ) {
      const topic = await this.getTopicById('topic-ktbs-heat-cl7-kn');
      const lesson = await this.getTopicLesson('topic-ktbs-heat-cl7-kn');
      if (topic && lesson) {
        return { topic, lesson, video: topic.videoMeta };
      }
    }

    // 2. KTBS Class 7 Mathematics: Integers (ಪೂರ್ಣಾಂಕಗಳು)
    if (
      params.chapterId === '02875d00-7eac-421b-9741-c7c94f11215f' ||
      textLower.includes('ಪೂರ್ಣಾಂಕ') ||
      textLower.includes('ಸಂಖ್ಯಾ ರೇಖೆ') ||
      textLower.includes('ಧನ ಸಂಖ್ಯೆ') ||
      textLower.includes('ಋಣ ಸಂಖ್ಯೆ') ||
      (textLower.includes('integer') && (params.grade === 7 || params.medium === 'kn'))
    ) {
      const topic = await this.getTopicById('topic-ktbs-integers-cl7-kn');
      const lesson = await this.getTopicLesson('topic-ktbs-integers-cl7-kn');
      if (topic && lesson) {
        return { topic, lesson, video: topic.videoMeta };
      }
    }

    // 3. KTBS Class 7 Science: Motion and Time (ಚಲನೆ ಮತ್ತು ಕಾಲ)
    if (
      params.chapterId === 'a1b2b711-5e11-4e80-910d-0f0472fde44c' ||
      textLower.includes('ಚಲನೆ') ||
      textLower.includes('ಆವರ್ತಕ') ||
      textLower.includes('ಲೋಲಕ') ||
      (textLower.includes('motion') && (params.grade === 7 || params.medium === 'kn'))
    ) {
      const topic = await this.getTopicById('topic-ktbs-motion-time-cl7-kn');
      const lesson = await this.getTopicLesson('topic-ktbs-motion-time-cl7-kn');
      if (topic && lesson) {
        return { topic, lesson, video: topic.videoMeta };
      }
    }

    // 4. KTBS Class 7 Mathematics: Lines and Angles (ರೇಖೆಗಳು ಮತ್ತು ಕೋನಗಳು)
    if (
      params.chapterId === '0fcfa5be-9f8e-4203-a84c-6feee3bc2334' ||
      textLower.includes('ರೇಖೆಗಳು') ||
      textLower.includes('ಕೋನಗಳು') ||
      textLower.includes('ಛೇದಕ') ||
      textLower.includes('ಸಮಾಂತರ ರೇಖೆ') ||
      (textLower.includes('angle') && (params.grade === 7 || params.medium === 'kn'))
    ) {
      const topic = await this.getTopicById('topic-ktbs-lines-angles-cl7-kn');
      const lesson = await this.getTopicLesson('topic-ktbs-lines-angles-cl7-kn');
      if (topic && lesson) {
        return { topic, lesson, video: topic.videoMeta };
      }
    }

    // -------------------------------------------------------------------------
    // B. CBSE / English Curriculum Matches
    // -------------------------------------------------------------------------

    // 5. Friction & Forces matching (Class 8)
    if (
      textLower.includes('friction') ||
      textLower.includes('opposing') ||
      textLower.includes('interlocking') ||
      textLower.includes('contact force') ||
      textLower.includes('forces and friction') ||
      params.documentId === 'doc-forces-and-friction-cl8'
    ) {
      const topic = await this.getTopicById('topic-forces-friction-cl8');
      const lesson = await this.getTopicLesson('topic-forces-friction-cl8');
      if (topic && lesson) {
        return { topic, lesson, video: topic.videoMeta };
      }
    }

    // 6. Shapes matching (Class 3)
    if (
      textLower.includes('shape') ||
      textLower.includes('circle') ||
      textLower.includes('triangle') ||
      textLower.includes('square') ||
      textLower.includes('vertex') ||
      textLower.includes('2d')
    ) {
      const topic = await this.getTopicById('topic-shapes-class3');
      const lesson = await this.getTopicLesson('topic-shapes-class3');
      if (topic && lesson) {
        return { topic, lesson, video: topic.videoMeta };
      }
    }

    // 7. Rotational Motion matching (Class 11)
    if (
      textLower.includes('torque') ||
      textLower.includes('rotation') ||
      textLower.includes('moment of inertia') ||
      textLower.includes('angular')
    ) {
      const topic = await this.getTopicById('topic-rotational-motion-cl11');
      const lesson = await this.getTopicLesson('topic-rotational-motion-cl11');
      if (topic && lesson) {
        return { topic, lesson, video: topic.videoMeta };
      }
    }

    return null;
  }
}

export const topicService = new TopicService();
