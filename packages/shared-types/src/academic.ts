/**
 * Academic Enrollment & Composition Domain Contracts
 */

export type EnrollmentStatus =
  | 'ACTIVE'
  | 'COMPLETED'
  | 'WITHDRAWN'
  | 'TRANSFERRED';

export interface AcademicEnrollment {
  id: string; // UUID v4
  learnerPersonId: string;
  organisationId?: string; // Optional: Independent learners have null organisationId
  classGroupId?: string;   // Optional: Null for independent learners
  boardId: string;
  academicYear: string;    // e.g. "2026-2027"
  officialGrade: number;   // Official enrolled standard (e.g. 7)
  primaryMedium: string;   // "en", "hi", "kn"
  status: EnrollmentStatus;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentSubject {
  id: string;
  enrollmentId: string;
  subjectId: string;
  curriculumVersionId: string;
  prescribedEditionId?: string;
  effectiveLevelGrade: number; // Enables remedial learning (e.g. Level 6 math while in official Grade 7)
  isRemedialTrack: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentCurriculum {
  learnerId: string;
  enrollmentId: string;
  academicYear: string;
  boardCode: string;
  officialGrade: number;
  medium: string;
  subjects: Array<{
    subjectCode: string;
    effectiveGrade: number;
    curriculumVersion: string;
    textbooks: Array<{
      editionId: string;
      title: string;
      publisher: string;
      editionYear: number;
      chaptersCount: number;
    }>;
  }>;
}

/**
 * Service Contract for Curriculum Resolution
 * Composition interface implemented by Academic Module
 */
export interface ICurriculumResolverService {
  resolveStudentCurriculum(learnerId: string): Promise<StudentCurriculum | null>;
}
