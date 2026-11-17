/**
 * GaonLab Smart Reader Module Contracts
 *
 * Defines canonical data contracts for textbook navigation, in-app chapter reading,
 * copyright/permission access enforcement, and contextual explanation resources.
 */

export type DocumentAccessMode =
  | 'IN_APP_AUTHORIZED'
  | 'USER_LOCAL_ONLY'
  | 'OFFICIAL_EXTERNAL_ONLY'
  | 'UNAVAILABLE';

export interface ReaderChapterDetail {
  chapterId: string;
  chapterNumber: number;
  title: string;
  accessMode: DocumentAccessMode;
  documentId?: string;
  officialSourceUrl?: string;
  hasExplanations: boolean;
  pageCount?: number;
}

export interface ReaderBookDetail {
  editionId: string;
  textbookId: string;
  title: string;
  grade: number;
  subject: string;
  publisher: string;
  language: string;
  academicYear: string;
  coverUrl?: string;
  officialSourceUrl: string;
  copyrightNotice: string;
  defaultAccessMode: DocumentAccessMode;
  chapters: ReaderChapterDetail[];
  totalChapters: number;
}

export interface ReaderDocument {
  documentId: string;
  title: string;
  topic: string;
  grade: number;
  subject: string;
  language: string;
  accessMode: DocumentAccessMode;
  url: string;
  totalEstimatedPages: number;
  license: string;
  author: string;
  copyrightNotice: string;
  isCompanionGuide: boolean;
  relatedChapterId?: string;
  relatedEditionId?: string;
}

export type VisualExplanationType = 'ANIMATED_CANVAS' | 'SVG_DIAGRAM' | 'INTERACTIVE_MODEL';

export interface ContextualExplanation {
  explanationId: string;
  topic: string;
  conceptId?: string;
  grade: number;
  medium: string;
  matchKeywords: string[];
  title: string;
  shortExplanation: string;
  visualType: VisualExplanationType;
  visualData: {
    animationType: 'FRICTION_SURFACES' | 'BLOCK_PULL' | 'MICROSCOPIC_INTERLOCKING' | 'BALL_BEARING';
    caption: string;
    labels?: { label: string; x: number; y: number }[];
  };
  realWorldExample: string;
  companionTip?: string;
}

export interface TextExplanationQuery {
  selectedText: string;
  chapterId?: string;
  documentId?: string;
  grade?: number;
  medium?: string;
}

export interface IReaderService {
  getBookDetails(editionId: string): Promise<ReaderBookDetail | null>;
  getChapterDetails(chapterId: string): Promise<ReaderChapterDetail | null>;
  getDocument(documentId: string): Promise<ReaderDocument | null>;
  getChapterExplanations(chapterId: string): Promise<ContextualExplanation[]>;
  resolveContextualExplanation(query: TextExplanationQuery): Promise<ContextualExplanation | null>;
}
