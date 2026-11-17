import { CurriculumStatus } from '@gaonlab/shared-types';

export interface CreateEducationBoardInput {
  id: string; // e.g. "CBSE", "KARNATAKA_STATE_BOARD"
  code: string;
  name: string;
  jurisdiction?: 'CENTRAL' | 'STATE';
  websiteUrl?: string;
}

export interface CreateFrameworkInput {
  id: string; // e.g. "NCF_SE_2023", "KCF_2024"
  code: string;
  name: string;
  adoptingAuthority: string;
  yearIntroduced: number;
  description?: string;
}

export interface CreateAuthorityInput {
  id: string; // e.g. "NCERT", "DSERT_KARNATAKA", "KSEAB"
  code: string;
  name: string;
  type: string;
  officialUrl?: string;
}

export interface CreatePublisherInput {
  id: string; // e.g. "NCERT_PUB", "KTBS"
  code: string;
  name: string;
  jurisdiction: string;
  officialCatalogUrl?: string;
}

export interface CreateCurriculumVersionInput {
  id?: string;
  boardId: string;
  frameworkId: string;
  levelId: string;
  subjectId: string;
  academicYear: string;
  medium: string;
  versionLabel: string;
  status?: CurriculumStatus;
  sourceReferenceUrl?: string;
}

export interface CreateTextbookInput {
  id?: string;
  publisherId: string;
  subjectId: string;
  levelId: string;
  canonicalTitle: string;
  isbn?: string;
  description?: string;
}

export interface CreateTextbookEditionInput {
  id?: string;
  textbookId: string;
  editionNumber?: number;
  publicationYear?: number;
  medium: string;
  titleInLanguage: string;
  sourceUrl?: string;
  licenceInfo?: string;
  status?: CurriculumStatus;
  isComplete?: boolean;
  totalChapters?: number;
}

export interface CreateChapterInput {
  id?: string;
  textbookEditionId: string;
  chapterNumber: number;
  title: string;
  officialCode?: string;
  pageStart?: number;
  pageEnd?: number;
  sourceUrl?: string;
  status?: CurriculumStatus;
  summaryNotes?: string;
  dikshaQrCode?: string;
}

export interface CurriculumCatalogueFilter {
  boardId?: string;
  grade?: number;
  levelId?: string;
  subjectId?: string;
  academicYear?: string;
  medium?: string;
  status?: CurriculumStatus;
}

export interface ResolvedSubjectCurriculum {
  subjectId: string;
  subjectName: string;
  stemPillar: string;
  curriculumVersionId: string;
  versionLabel: string;
  status: CurriculumStatus;
  textbooks: Array<{
    textbookId: string;
    canonicalTitle: string;
    publisherName: string;
    editionId: string;
    editionNumber: number;
    publicationYear: number;
    medium: string;
    titleInLanguage: string;
    isPrescribed: boolean;
    isComplete: boolean;
    totalChapters: number;
    sourceUrl?: string | null;
    licenceInfo?: string | null;
    chapters: Array<{
      chapterId: string;
      chapterNumber: number;
      title: string;
      officialCode?: string | null;
      pageStart?: number | null;
      pageEnd?: number | null;
      sourceUrl?: string | null;
      status: CurriculumStatus;
    }>;
  }>;
}

export interface StudentCurriculumResolution {
  learnerId: string;
  enrollmentId: string;
  board: {
    id: string;
    code: string;
    name: string;
    jurisdiction: string;
  };
  grade: number;
  levelId: string;
  academicYear: string;
  primaryMedium: string;
  subjects: ResolvedSubjectCurriculum[];
}

export interface ICurriculumService {
  createBoard(input: CreateEducationBoardInput): Promise<any>;
  createFramework(input: CreateFrameworkInput): Promise<any>;
  createAuthority(input: CreateAuthorityInput): Promise<any>;
  createPublisher(input: CreatePublisherInput): Promise<any>;
  createCurriculumVersion(input: CreateCurriculumVersionInput): Promise<any>;
  createTextbook(input: CreateTextbookInput): Promise<any>;
  createTextbookEdition(input: CreateTextbookEditionInput): Promise<any>;
  createChapter(input: CreateChapterInput): Promise<any>;
  linkCurriculumTextbook(curriculumVersionId: string, textbookEditionId: string, isPrescribed?: boolean): Promise<any>;
  getBoards(): Promise<any[]>;
  getGradesForBoard(boardId: string): Promise<any[]>;
  getSubjectsForGrade(gradeId: string, boardId?: string): Promise<any[]>;
  getCatalogue(filter?: CurriculumCatalogueFilter): Promise<any[]>;
  getTextbookById(textbookId: string): Promise<any>;
  getChaptersByEditionId(editionId: string): Promise<any[]>;
  getCurriculumTree(boardId: string, levelId: string, academicYear: string, medium: string): Promise<any>;
  resolveStudentCurriculum(learnerId: string): Promise<StudentCurriculumResolution>;
}
