export interface DemoProfile {
  name: string;
  email: string;
  boardId: string;
  boardName: string;
  grade: number;
  medium: string;
  mediumName: string;
  subjects: string[];
  schoolName?: string;
  interests?: string;
}

export interface EducationBoard {
  id: string;
  code: string;
  name: string;
  jurisdiction: string;
  websiteUrl?: string;
}

export interface GradeLevel {
  id: string;
  numericGrade: number;
  stage: string;
  name: string;
}

export interface SubjectItem {
  id: string;
  code: string;
  name: string;
  stemPillar: string;
  description?: string;
}

export interface ChapterItem {
  id: string;
  chapterNumber: number;
  title: string;
  officialCode?: string | null;
  pageStart?: number | null;
  pageEnd?: number | null;
  sourceUrl?: string | null;
  status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'ARCHIVED' | 'PUBLISHED' | 'DRAFT';
}

export interface TextbookInfo {
  id: string;
  canonicalTitle: string;
  isbn?: string | null;
  description?: string | null;
  publisher: {
    id: string;
    code: string;
    name: string;
  };
}

export interface TextbookEditionItem {
  id: string;
  editionNumber: number;
  publicationYear: number;
  medium: string;
  titleInLanguage: string;
  sourceUrl?: string | null;
  status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'ARCHIVED' | 'PUBLISHED' | 'DRAFT';
  totalChapters: number;
  textbook: TextbookInfo;
  chapters?: ChapterItem[];
}

export interface CatalogueEntry {
  id: string;
  boardId: string;
  medium: string;
  academicYear: string;
  level: GradeLevel;
  subject: SubjectItem;
  curriculumTextbooks: Array<{
    id: string;
    isPrescribed: boolean;
    textbookEdition: TextbookEditionItem;
  }>;
}

export type FeatureModuleStatus =
  | 'REGISTERED'
  | 'NOT_IMPLEMENTED'
  | 'INTEGRATION_PENDING'
  | 'ACTIVE'
  | 'DISABLED';

export interface FeatureModuleItem {
  featureId: string;
  name: string;
  displayNameInLanguage?: Record<string, string>;
  description: string;
  frontendRoute: string;
  status: FeatureModuleStatus;
  owner: string;
  supportedLearnerSegments: string[];
  requiredPermissions: string[];
  featureFlagKey: string;
  integrationReadiness: {
    contractsDefined: boolean;
    routerMounted: boolean;
    uiPlaceholderReady: boolean;
    businessLogicImplemented: boolean;
  };
}
