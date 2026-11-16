import {
  EnrollmentStatus,
  ICurriculumResolverService,
  StudentCurriculum,
} from '@gaonlab/shared-types';

export interface CreateAcademicEnrollmentInput {
  learnerPersonId: string;
  organisationId?: string; // Optional for independent learners
  classGroupId?: string;   // Optional for independent learners
  boardId: string;
  academicYear: string;    // e.g. "2026-2027"
  officialGrade: number;   // e.g. 6, 7, 8
  primaryMedium: string;   // "en", "hi", "kn"
  status?: EnrollmentStatus;
}

export interface AddEnrollmentSubjectInput {
  enrollmentId: string;
  subjectId: string;
  curriculumVersionId: string;
  prescribedEditionId?: string;
  effectiveLevelGrade: number;
  isRemedialTrack?: boolean;
}

export interface IAcademicService extends ICurriculumResolverService {
  enrollLearner(input: CreateAcademicEnrollmentInput): Promise<any>;
  addEnrollmentSubject(input: AddEnrollmentSubjectInput): Promise<any>;
  getActiveEnrollment(learnerPersonId: string): Promise<any>;
  getEnrollmentHistory(learnerPersonId: string): Promise<any[]>;
  resolveStudentCurriculum(learnerId: string): Promise<StudentCurriculum | null>;
}
