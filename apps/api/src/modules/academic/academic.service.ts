import { prisma } from '../../shared/database/prisma';
import { NotFoundError } from '../../shared/errors';
import { eventBus } from '../../shared/events';
import {
  AddEnrollmentSubjectInput,
  CreateAcademicEnrollmentInput,
  IAcademicService,
} from './academic.contracts';
import { StudentCurriculum } from '@gaonlab/shared-types';

export class AcademicService implements IAcademicService {
  async enrollLearner(input: CreateAcademicEnrollmentInput) {
    const enrollment = await prisma.academicEnrollment.create({
      data: {
        learnerPersonId: input.learnerPersonId,
        organisationId: input.organisationId,
        classGroupId: input.classGroupId,
        boardId: input.boardId,
        academicYear: input.academicYear,
        officialGrade: input.officialGrade,
        primaryMedium: input.primaryMedium,
        status: input.status || 'ACTIVE',
      },
      include: {
        board: true,
        organisation: true,
      },
    });

    eventBus.publish({
      eventId: crypto.randomUUID(),
      type: 'ACADEMIC_ENROLLMENT_CREATED',
      schemaVersion: '1.0.0',
      occurredAt: new Date().toISOString(),
      learnerId: input.learnerPersonId,
      payload: {
        enrollmentId: enrollment.id,
        boardId: input.boardId,
        officialGrade: input.officialGrade,
        academicYear: input.academicYear,
        isIndependent: !input.organisationId,
      },
    });

    return enrollment;
  }

  async addEnrollmentSubject(input: AddEnrollmentSubjectInput) {
    return prisma.enrollmentSubject.create({
      data: {
        enrollmentId: input.enrollmentId,
        subjectId: input.subjectId,
        curriculumVersionId: input.curriculumVersionId,
        prescribedEditionId: input.prescribedEditionId,
        effectiveLevelGrade: input.effectiveLevelGrade,
        isRemedialTrack: input.isRemedialTrack ?? false,
      },
    });
  }

  async getActiveEnrollment(learnerPersonId: string) {
    const enrollment = await prisma.academicEnrollment.findFirst({
      where: {
        learnerPersonId,
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'desc' },
      include: {
        board: true,
        organisation: { include: { schoolProfile: true } },
        classGroup: true,
        subjects: {
          include: {
            subject: true,
            curriculumVersion: true,
            prescribedEdition: { include: { textbook: true } },
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundError('Active AcademicEnrollment for learner', learnerPersonId);
    }

    return enrollment;
  }

  async getEnrollmentHistory(learnerPersonId: string) {
    return prisma.academicEnrollment.findMany({
      where: { learnerPersonId },
      orderBy: { academicYear: 'desc' },
      include: {
        board: true,
        organisation: true,
        subjects: { include: { subject: true } },
      },
    });
  }

  /**
   * Central Curriculum Resolver Contract Implementation
   * Returns null if no verified curriculum tree has been imported yet.
   */
  async resolveStudentCurriculum(learnerId: string): Promise<StudentCurriculum | null> {
    const enrollment = await prisma.academicEnrollment.findFirst({
      where: {
        learnerPersonId: learnerId,
        status: 'ACTIVE',
      },
      include: {
        board: true,
        subjects: {
          include: {
            subject: true,
            curriculumVersion: {
              include: {
                curriculumTextbooks: {
                  include: {
                    textbookEdition: {
                      include: {
                        textbook: { include: { publisher: true } },
                        chapters: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      return null;
    }

    return {
      learnerId,
      enrollmentId: enrollment.id,
      academicYear: enrollment.academicYear,
      boardCode: enrollment.board.code,
      officialGrade: enrollment.officialGrade,
      medium: enrollment.primaryMedium,
      subjects: enrollment.subjects.map((s) => ({
        subjectCode: s.subject.code,
        effectiveGrade: s.effectiveLevelGrade,
        curriculumVersion: s.curriculumVersion.versionLabel,
        textbooks: s.curriculumVersion.curriculumTextbooks.map((ct) => ({
          editionId: ct.textbookEdition.id,
          title: ct.textbookEdition.titleInLanguage,
          publisher: ct.textbookEdition.textbook.publisherId,
          editionYear: ct.textbookEdition.publicationYear,
          chaptersCount: ct.textbookEdition.chapters.length,
        })),
      })),
    };
  }
}

export const academicService = new AcademicService();
