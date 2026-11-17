/**
 * Curriculum Domain Contracts
 * Rigorous multi-authority curriculum modeling for Academic Year 2026-27 and beyond
 */

export type CurriculumStatus =
  | 'DRAFT'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'PUBLISHED'
  | 'ARCHIVED';

export type AuthorityType =
  | 'NATIONAL_CURRICULAR_BODY'  // NCERT
  | 'STATE_CURRICULAR_BODY'     // DSERT Karnataka
  | 'EXAMINATION_BOARD'         // CBSE, KSEAB
  | 'STANDARDS_BODY';           // PARAKH

export interface EducationBoard {
  id: string; // e.g. "CBSE", "KARNATAKA_STATE_BOARD"
  code: string;
  name: string;
  jurisdiction: 'CENTRAL' | 'STATE';
  websiteUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurriculumFramework {
  id: string; // e.g. "NCF_SE_2023", "KCF_2024"
  code: string;
  name: string;
  adoptingAuthority: string;
  yearIntroduced: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurriculumAuthority {
  id: string; // e.g. "NCERT", "DSERT_KARNATAKA"
  code: string;
  name: string;
  type: AuthorityType;
  officialUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TextbookPublisher {
  id: string; // e.g. "NCERT_PUB", "KTBS"
  code: string;
  name: string;
  jurisdiction: string;
  officialCatalogUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Programme {
  id: string; // e.g. "K12_GENERAL", "VOCATIONAL"
  code: string;
  name: string;
  description?: string;
}

export interface Level {
  id: string; // e.g. "GRADE_6", "GRADE_7", "GRADE_8"
  programmeId: string;
  numericGrade: number; // 6, 7, 8
  stage: 'PRIMARY' | 'MIDDLE' | 'SECONDARY' | 'HIGHER_SECONDARY';
  name: string;
}

export interface Subject {
  id: string; // e.g. "MATHEMATICS", "SCIENCE"
  code: string;
  name: string;
  stemPillar: 'SCIENCE' | 'TECHNOLOGY' | 'ENGINEERING' | 'MATHEMATICS';
  description?: string;
}

export interface CurriculumVersion {
  id: string;
  boardId: string;
  frameworkId: string;
  levelId: string;
  subjectId: string;
  academicYear: string; // e.g. "2026-2027"
  medium: string; // "en", "hi", "kn"
  status: CurriculumStatus;
  versionLabel: string; // e.g. "2026-27.v1"
  sourceReferenceUrl?: string;
  verifiedAt?: string;
  verifiedByActorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Textbook {
  id: string;
  publisherId: string;
  subjectId: string;
  levelId: string;
  canonicalTitle: string; // e.g. "Curiosity" (Grade 6 Science)
  isbn?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TextbookEdition {
  id: string;
  textbookId: string;
  editionNumber: number;
  publicationYear: number; // e.g. 2024, 2025, 2026
  medium: string; // "en", "hi", "kn"
  titleInLanguage: string;
  sourceUrl?: string;
  licenceInfo?: string;
  status: CurriculumStatus;
  isComplete: boolean; // false if partial / incomplete chapters
  totalChapters: number;
  createdAt: string;
  updatedAt: string;
}

export interface CurriculumTextbook {
  id: string;
  curriculumVersionId: string;
  textbookEditionId: string;
  isPrescribed: boolean; // true if core prescribed textbook
  createdAt: string;
}

export interface Chapter {
  id: string;
  textbookEditionId: string;
  chapterNumber: number;
  title: string;
  officialCode?: string;
  pageStart?: number;
  pageEnd?: number;
  sourceUrl?: string;
  status: CurriculumStatus;
  summaryNotes?: string;
  dikshaQrCode?: string; // QR code identifier linking to DIKSHA
  createdAt: string;
  updatedAt: string;
}

export interface LearningOutcome {
  id: string;
  chapterId: string;
  code: string; // e.g. "SCI-G7-C02-LO01"
  description: string;
  competencyPillar: string;
  parakhStandardRef?: string;
  createdAt: string;
  updatedAt: string;
}
