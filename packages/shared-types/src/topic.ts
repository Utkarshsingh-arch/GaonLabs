/**
 * GaonLab Explore STEM & Topic Learning Shared Types
 */

export type TopicAccessMode =
  | 'GAONLAB_FULL'
  | 'HYBRID'
  | 'OFFICIAL_EXTERNAL'
  | 'UNAVAILABLE';

export type TopicContentStatus =
  | 'DRAFT'
  | 'VERIFIED'
  | 'PUBLISHED'
  | 'ARCHIVED';

export interface TopicGlossaryItem {
  term: string;
  definition: string;
}

export interface TopicPrincipleItem {
  title: string;
  statement: string;
  formula?: string;
  explanation: string;
}

export interface TopicDiagramItem {
  id: string;
  title: string;
  caption: string;
  type: 'CANVAS_ANIMATION' | 'SVG_ILLUSTRATION' | 'INTERACTIVE_MODEL';
  spec?: Record<string, any>;
}

export interface TopicLesson {
  topicId: string;
  title: string;
  grade: number;
  subject: string;
  language: string;
  topicIntroduction: string;
  simpleExplanation: string;
  scientificPrinciples: TopicPrincipleItem[];
  examples: Array<{
    title: string;
    description: string;
    context: string;
  }>;
  diagrams: TopicDiagramItem[];
  realWorldApplications: Array<{
    title: string;
    description: string;
    villageContext?: string;
  }>;
  importantTakeaways: string[];
  glossary: TopicGlossaryItem[];
}

export interface TopicVideoMeta {
  videoId: string;
  topicId: string;
  title: string;
  language: string;
  streamUrl: string;
  durationSeconds: number;
  resolution: string; // e.g. "1280x720"
  hasAudio: boolean;
  captionsUrl?: string; // WebVTT URL
  transcriptUrl?: string;
  transcriptText?: string;
  generationStatus: 'PENDING' | 'GENERATED' | 'FAILED';
  contentReviewStatus: 'VERIFIED' | 'NEEDS_REVIEW';
}

export interface TopicOfficialResource {
  topicId: string;
  boardName: string;
  textbookTitle: string;
  editionId?: string;
  chapterNumber?: number;
  chapterTitle?: string;
  chapterId?: string;
  pageRange?: string;
  officialSourceUrl: string;
  publisher: string;
  licenceNotice: string;
  disclaimer: string;
}

export interface TopicSummary {
  topicId: string;
  title: string;
  shortDescription: string;
  boardId: string;
  frameworkId: string;
  grade: number;
  subjectId: string;
  subjectName: string;
  stemPillar: string;
  medium: string;
  academicYear: string;
  accessMode: TopicAccessMode;
  contentStatus: TopicContentStatus;
  hasLesson: boolean;
  hasVideo: boolean;
  hasOfficialResources: boolean;
  relatedEditionId?: string;
  relatedChapterId?: string;
  coverImage?: string;
  difficulty?: 'FOUNDATIONAL' | 'INTERMEDIATE' | 'ADVANCED';
}

export interface TopicDetail extends TopicSummary {
  officialResources?: TopicOfficialResource;
  videoMeta?: TopicVideoMeta;
  lessonOverview?: string;
}

export interface TopicMatchResult {
  topicId: string;
  topicTitle: string;
  matchedConcept: string;
  grade: number;
  subjectName: string;
  hasLesson: boolean;
  hasVideo: boolean;
  videoUrl?: string;
  matchScore: number;
}

