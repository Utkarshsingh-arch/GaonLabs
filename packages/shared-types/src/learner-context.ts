/**
 * Universal Learner Context Contract
 * Consumed by all downstream learning and gamification modules.
 * Strictly adheres to DPDP Act 2023 data minimization.
 */

export type LearnerCategory = 'PRIMARY' | 'MIDDLE' | 'SECONDARY' | 'POST_SCHOOL';

export type AgeSegment = 'UNDER_13' | '13_TO_17' | '18_AND_ABOVE';

export type AccountStatus =
  | 'REGISTERED_PENDING_CONSENT'
  | 'ACTIVATED'
  | 'SUSPENDED'
  | 'DEACTIVATED';

export type SupportedLanguage = 'en' | 'hi' | 'kn';

export type SupportedBoard = 'CBSE' | 'KARNATAKA_STATE_BOARD';

export type SupportedSubject = 'MATHEMATICS' | 'SCIENCE';

export interface PrescribedTextbookBinding {
  subjectCode: SupportedSubject;
  textbookIdentifier: string;
  title: string;
  editionYear: number;
  publisher: string;
  language: SupportedLanguage;
  totalChapters: number;
}

export interface LearnerContext {
  // 1. Identity & Profile
  learnerId: string; // UUID v4
  learnerCategory: LearnerCategory;
  ageSegment: AgeSegment;
  accountStatus: AccountStatus;

  // 2. Preferences & Medium
  preferredInterfaceLanguage: SupportedLanguage;
  mediumOfInstruction: SupportedLanguage;

  // 3. Institutional Association (Optional)
  institution: {
    isAssociated: boolean;
    schoolId?: string;
    udiseCode?: string;
    schoolName?: string;
    classId?: string;
    sectionName?: string;
  };

  // 4. Active Academic Enrollment
  academic: {
    enrollmentId: string;
    academicYear: string; // e.g. "2026-2027"
    boardCode: SupportedBoard;
    grade: number; // 6, 7, 8 initially
    curriculumVersion: string;
    activeSubjectCodes: SupportedSubject[];
  };

  // 5. Prescribed Textbooks Binding
  prescribedTextbooks: PrescribedTextbookBinding[];

  // 6. Security, Policy & Permissions
  permissions: {
    canAccessOnlineAI: boolean;
    canJoinInterSchoolMissions: boolean;
    canUploadGradeCards: boolean;
    hasVerifiedGuardianConsent: boolean;
    dataProcessingConsented: boolean;
  };

  // 7. Context Metadata
  contextResolvedAt: string; // ISO 8601 UTC
  contextExpiresAt: string;   // ISO 8601 UTC (for client-side cache TTL)
}
