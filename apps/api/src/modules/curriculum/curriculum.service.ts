import { prisma } from '../../shared/database/prisma';
import { NotFoundError } from '../../shared/errors';
import {
  CreateAuthorityInput,
  CreateChapterInput,
  CreateCurriculumVersionInput,
  CreateEducationBoardInput,
  CreateFrameworkInput,
  CreatePublisherInput,
  CreateTextbookEditionInput,
  CreateTextbookInput,
  CurriculumCatalogueFilter,
  ICurriculumService,
  StudentCurriculumResolution,
} from './curriculum.contracts';

export class CurriculumService implements ICurriculumService {
  async createBoard(input: CreateEducationBoardInput) {
    return prisma.educationBoard.upsert({
      where: { id: input.id },
      update: {
        code: input.code,
        name: input.name,
        jurisdiction: input.jurisdiction || 'STATE',
        websiteUrl: input.websiteUrl,
      },
      create: {
        id: input.id,
        code: input.code,
        name: input.name,
        jurisdiction: input.jurisdiction || 'STATE',
        websiteUrl: input.websiteUrl,
      },
    });
  }

  async createFramework(input: CreateFrameworkInput) {
    return prisma.curriculumFramework.upsert({
      where: { id: input.id },
      update: {
        code: input.code,
        name: input.name,
        adoptingAuthority: input.adoptingAuthority,
        yearIntroduced: input.yearIntroduced,
        description: input.description,
      },
      create: {
        id: input.id,
        code: input.code,
        name: input.name,
        adoptingAuthority: input.adoptingAuthority,
        yearIntroduced: input.yearIntroduced,
        description: input.description,
      },
    });
  }

  async createAuthority(input: CreateAuthorityInput) {
    return prisma.curriculumAuthority.upsert({
      where: { id: input.id },
      update: {
        code: input.code,
        name: input.name,
        type: input.type,
        officialUrl: input.officialUrl,
      },
      create: {
        id: input.id,
        code: input.code,
        name: input.name,
        type: input.type,
        officialUrl: input.officialUrl,
      },
    });
  }

  async createPublisher(input: CreatePublisherInput) {
    return prisma.textbookPublisher.upsert({
      where: { id: input.id },
      update: {
        code: input.code,
        name: input.name,
        jurisdiction: input.jurisdiction,
        officialCatalogUrl: input.officialCatalogUrl,
      },
      create: {
        id: input.id,
        code: input.code,
        name: input.name,
        jurisdiction: input.jurisdiction,
        officialCatalogUrl: input.officialCatalogUrl,
      },
    });
  }

  async createCurriculumVersion(input: CreateCurriculumVersionInput) {
    return prisma.curriculumVersion.upsert({
      where: {
        boardId_frameworkId_levelId_subjectId_academicYear_medium: {
          boardId: input.boardId,
          frameworkId: input.frameworkId,
          levelId: input.levelId,
          subjectId: input.subjectId,
          academicYear: input.academicYear,
          medium: input.medium,
        },
      },
      update: {
        versionLabel: input.versionLabel,
        status: input.status || 'PENDING_VERIFICATION',
        sourceReferenceUrl: input.sourceReferenceUrl,
      },
      create: {
        id: input.id,
        boardId: input.boardId,
        frameworkId: input.frameworkId,
        levelId: input.levelId,
        subjectId: input.subjectId,
        academicYear: input.academicYear,
        medium: input.medium,
        versionLabel: input.versionLabel,
        status: input.status || 'PENDING_VERIFICATION',
        sourceReferenceUrl: input.sourceReferenceUrl,
      },
    });
  }

  async createTextbook(input: CreateTextbookInput) {
    return prisma.textbook.upsert({
      where: {
        publisherId_subjectId_levelId_canonicalTitle: {
          publisherId: input.publisherId,
          subjectId: input.subjectId,
          levelId: input.levelId,
          canonicalTitle: input.canonicalTitle,
        },
      },
      update: {
        isbn: input.isbn,
        description: input.description,
      },
      create: {
        id: input.id,
        publisherId: input.publisherId,
        subjectId: input.subjectId,
        levelId: input.levelId,
        canonicalTitle: input.canonicalTitle,
        isbn: input.isbn,
        description: input.description,
      },
    });
  }

  async createTextbookEdition(input: CreateTextbookEditionInput) {
    return prisma.textbookEdition.upsert({
      where: {
        textbookId_editionNumber_medium: {
          textbookId: input.textbookId,
          editionNumber: input.editionNumber || 1,
          medium: input.medium,
        },
      },
      update: {
        publicationYear: input.publicationYear || 2026,
        titleInLanguage: input.titleInLanguage,
        sourceUrl: input.sourceUrl,
        licenceInfo: input.licenceInfo,
        status: input.status || 'PENDING_VERIFICATION',
        isComplete: input.isComplete ?? false,
        totalChapters: input.totalChapters ?? 0,
      },
      create: {
        id: input.id,
        textbookId: input.textbookId,
        editionNumber: input.editionNumber || 1,
        publicationYear: input.publicationYear || 2026,
        medium: input.medium,
        titleInLanguage: input.titleInLanguage,
        sourceUrl: input.sourceUrl,
        licenceInfo: input.licenceInfo,
        status: input.status || 'PENDING_VERIFICATION',
        isComplete: input.isComplete ?? false,
        totalChapters: input.totalChapters ?? 0,
      },
    });
  }

  async createChapter(input: CreateChapterInput) {
    return prisma.chapter.upsert({
      where: {
        textbookEditionId_chapterNumber: {
          textbookEditionId: input.textbookEditionId,
          chapterNumber: input.chapterNumber,
        },
      },
      update: {
        title: input.title,
        officialCode: input.officialCode,
        pageStart: input.pageStart,
        pageEnd: input.pageEnd,
        sourceUrl: input.sourceUrl,
        status: input.status || 'PENDING_VERIFICATION',
        summaryNotes: input.summaryNotes,
        dikshaQrCode: input.dikshaQrCode,
      },
      create: {
        id: input.id,
        textbookEditionId: input.textbookEditionId,
        chapterNumber: input.chapterNumber,
        title: input.title,
        officialCode: input.officialCode,
        pageStart: input.pageStart,
        pageEnd: input.pageEnd,
        sourceUrl: input.sourceUrl,
        status: input.status || 'PENDING_VERIFICATION',
        summaryNotes: input.summaryNotes,
        dikshaQrCode: input.dikshaQrCode,
      },
    });
  }

  async linkCurriculumTextbook(curriculumVersionId: string, textbookEditionId: string, isPrescribed = true) {
    return prisma.curriculumTextbook.upsert({
      where: {
        curriculumVersionId_textbookEditionId: {
          curriculumVersionId,
          textbookEditionId,
        },
      },
      update: {
        isPrescribed,
      },
      create: {
        curriculumVersionId,
        textbookEditionId,
        isPrescribed,
      },
    });
  }

  async getBoards() {
    return prisma.educationBoard.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getGradesForBoard(boardId: string) {
    const versions = await prisma.curriculumVersion.findMany({
      where: { boardId },
      include: { level: true },
      distinct: ['levelId'],
    });

    return versions
      .map((v) => ({
        id: v.level.id,
        numericGrade: v.level.numericGrade,
        stage: v.level.stage,
        name: v.level.name,
      }))
      .sort((a, b) => a.numericGrade - b.numericGrade);
  }

  async getSubjectsForGrade(gradeId: string, boardId?: string) {
    const where: any = { levelId: gradeId };
    if (boardId) {
      where.boardId = boardId;
    }

    const versions = await prisma.curriculumVersion.findMany({
      where,
      include: { subject: true },
      distinct: ['subjectId'],
    });

    return versions.map((v) => ({
      id: v.subject.id,
      code: v.subject.code,
      name: v.subject.name,
      stemPillar: v.subject.stemPillar,
      description: v.subject.description,
    }));
  }

  async getCatalogue(filter?: CurriculumCatalogueFilter) {
    const where: any = {};
    if (filter?.boardId) where.boardId = filter.boardId;
    if (filter?.levelId) where.levelId = filter.levelId;
    if (filter?.subjectId) where.subjectId = filter.subjectId;
    if (filter?.academicYear) where.academicYear = filter.academicYear;
    if (filter?.medium) where.medium = filter.medium;
    if (filter?.status) where.status = filter.status;

    if (filter?.grade) {
      where.level = { numericGrade: filter.grade };
    }

    const versions = await prisma.curriculumVersion.findMany({
      where,
      include: {
        board: true,
        framework: true,
        level: true,
        subject: true,
        curriculumTextbooks: {
          include: {
            textbookEdition: {
              include: {
                textbook: {
                  include: { publisher: true },
                },
                chapters: {
                  orderBy: { chapterNumber: 'asc' },
                },
              },
            },
          },
        },
      },
      orderBy: [
        { academicYear: 'asc' },
        { boardId: 'asc' },
        { medium: 'asc' },
      ],
    });

    return versions;
  }

  async getTextbookById(textbookId: string) {
    const textbook = await prisma.textbook.findUnique({
      where: { id: textbookId },
      include: {
        publisher: true,
        subject: true,
        level: true,
        editions: {
          include: {
            chapters: {
              orderBy: { chapterNumber: 'asc' },
            },
          },
        },
      },
    });

    if (!textbook) {
      throw new NotFoundError('Textbook', textbookId);
    }

    return textbook;
  }

  async getChaptersByEditionId(editionId: string) {
    const edition = await prisma.textbookEdition.findUnique({
      where: { id: editionId },
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' },
          include: { learningOutcomes: true },
        },
        textbook: {
          include: { publisher: true, subject: true, level: true },
        },
      },
    });

    if (!edition) {
      throw new NotFoundError('TextbookEdition', editionId);
    }

    return edition.chapters;
  }

  async getCurriculumTree(boardId: string, levelId: string, academicYear: string, medium: string) {
    const versions = await prisma.curriculumVersion.findMany({
      where: {
        boardId,
        levelId,
        academicYear,
        medium,
      },
      include: {
        board: true,
        framework: true,
        subject: true,
        level: true,
        curriculumTextbooks: {
          include: {
            textbookEdition: {
              include: {
                textbook: {
                  include: { publisher: true },
                },
                chapters: {
                  orderBy: { chapterNumber: 'asc' },
                  include: { learningOutcomes: true },
                },
              },
            },
          },
        },
      },
    });

    if (!versions.length) {
      throw new NotFoundError(
        'CurriculumVersion',
        `Board: ${boardId}, Level: ${levelId}, Year: ${academicYear}, Medium: ${medium}`
      );
    }

    return versions;
  }

  async resolveStudentCurriculum(learnerId: string): Promise<StudentCurriculumResolution> {
    // 1. Locate student's active enrollment
    const enrollment = await prisma.academicEnrollment.findFirst({
      where: {
        learnerPersonId: learnerId,
        status: 'ACTIVE',
      },
      include: {
        board: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundError('AcademicEnrollment', `Learner ID: ${learnerId}`);
    }

    // 2. Map officialGrade (e.g. 6, 7, 8) to levelId
    const levelId = `GRADE_${enrollment.officialGrade}`;

    // 3. Find matching curriculum versions for the student's board, level, year, and medium
    const versions = await prisma.curriculumVersion.findMany({
      where: {
        boardId: enrollment.boardId,
        levelId,
        academicYear: enrollment.academicYear,
        medium: enrollment.primaryMedium,
      },
      include: {
        subject: true,
        curriculumTextbooks: {
          where: { isPrescribed: true },
          include: {
            textbookEdition: {
              include: {
                textbook: {
                  include: { publisher: true },
                },
                chapters: {
                  orderBy: { chapterNumber: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    const subjects = versions.map((v) => ({
      subjectId: v.subject.id,
      subjectName: v.subject.name,
      stemPillar: v.subject.stemPillar,
      curriculumVersionId: v.id,
      versionLabel: v.versionLabel,
      status: v.status,
      textbooks: v.curriculumTextbooks.map((ct) => ({
        textbookId: ct.textbookEdition.textbook.id,
        canonicalTitle: ct.textbookEdition.textbook.canonicalTitle,
        publisherName: ct.textbookEdition.textbook.publisher.name,
        editionId: ct.textbookEdition.id,
        editionNumber: ct.textbookEdition.editionNumber,
        publicationYear: ct.textbookEdition.publicationYear,
        medium: ct.textbookEdition.medium,
        titleInLanguage: ct.textbookEdition.titleInLanguage,
        isPrescribed: ct.isPrescribed,
        isComplete: ct.textbookEdition.isComplete,
        totalChapters: ct.textbookEdition.totalChapters,
        sourceUrl: ct.textbookEdition.sourceUrl,
        licenceInfo: ct.textbookEdition.licenceInfo,
        chapters: ct.textbookEdition.chapters.map((ch) => ({
          chapterId: ch.id,
          chapterNumber: ch.chapterNumber,
          title: ch.title,
          officialCode: ch.officialCode,
          pageStart: ch.pageStart,
          pageEnd: ch.pageEnd,
          sourceUrl: ch.sourceUrl,
          status: ch.status,
        })),
      })),
    }));

    return {
      learnerId,
      enrollmentId: enrollment.id,
      board: {
        id: enrollment.board.id,
        code: enrollment.board.code,
        name: enrollment.board.name,
        jurisdiction: enrollment.board.jurisdiction,
      },
      grade: enrollment.officialGrade,
      levelId,
      academicYear: enrollment.academicYear,
      primaryMedium: enrollment.primaryMedium,
      subjects,
    };
  }
}

export const curriculumService = new CurriculumService();
