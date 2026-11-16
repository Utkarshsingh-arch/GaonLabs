import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma, disconnectDatabase } from '../shared/database/prisma';
import { curriculumService } from '../modules/curriculum';

describe('Curriculum Architecture & Authority Boundaries', () => {
  beforeAll(async () => {
    // 1. Setup distinct Boards
    await curriculumService.createBoard({
      id: 'CBSE',
      code: 'CBSE',
      name: 'Central Board of Secondary Education',
      jurisdiction: 'CENTRAL',
      websiteUrl: 'https://cbse.gov.in',
    });

    await curriculumService.createBoard({
      id: 'KARNATAKA_STATE_BOARD',
      code: 'KSEAB',
      name: 'Karnataka School Examination and Assessment Board',
      jurisdiction: 'STATE',
      websiteUrl: 'https://kseab.karnataka.gov.in',
    });

    // 2. Setup distinct Authorities
    await curriculumService.createAuthority({
      id: 'NCERT',
      code: 'NCERT',
      name: 'National Council of Educational Research and Training',
      type: 'NATIONAL_CURRICULAR_BODY',
      officialUrl: 'https://ncert.nic.in',
    });

    await curriculumService.createAuthority({
      id: 'DSERT_KARNATAKA',
      code: 'DSERT',
      name: 'Department of State Educational Research and Training Karnataka',
      type: 'STATE_CURRICULAR_BODY',
      officialUrl: 'https://dsert.karnataka.gov.in',
    });

    // 3. Setup distinct Publishers
    await curriculumService.createPublisher({
      id: 'NCERT_PUB',
      code: 'NCERT_PUBLISHING',
      name: 'NCERT Publication Division',
      jurisdiction: 'NATIONAL',
    });

    await curriculumService.createPublisher({
      id: 'KTBS',
      code: 'KTBS_PUBLISHING',
      name: 'Karnataka Textbook Society',
      jurisdiction: 'KARNATAKA',
      officialCatalogUrl: 'https://textbooks.karnataka.gov.in',
    });

    // 4. Setup Frameworks, Programme, Levels, Subjects
    await curriculumService.createFramework({
      id: 'NCF_SE_2023',
      code: 'NCF_SE',
      name: 'National Curriculum Framework for School Education 2023',
      adoptingAuthority: 'NCERT',
      yearIntroduced: 2023,
    });

    await prisma.programme.upsert({
      where: { id: 'K12_GENERAL' },
      update: {},
      create: { id: 'K12_GENERAL', code: 'K12', name: 'K-12 School Education' },
    });

    await prisma.level.upsert({
      where: { id: 'GRADE_6' },
      update: {},
      create: { id: 'GRADE_6', programmeId: 'K12_GENERAL', numericGrade: 6, stage: 'MIDDLE', name: 'Grade 6' },
    });

    await prisma.level.upsert({
      where: { id: 'GRADE_7' },
      update: {},
      create: { id: 'GRADE_7', programmeId: 'K12_GENERAL', numericGrade: 7, stage: 'MIDDLE', name: 'Grade 7' },
    });

    await prisma.subject.upsert({
      where: { id: 'SCIENCE' },
      update: {},
      create: { id: 'SCIENCE', code: 'SCI', name: 'Science', stemPillar: 'SCIENCE' },
    });
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('CBSE and Karnataka State Board are distinct board entities in the database', async () => {
    const cbse = await prisma.educationBoard.findUnique({ where: { id: 'CBSE' } });
    const kt = await prisma.educationBoard.findUnique({ where: { id: 'KARNATAKA_STATE_BOARD' } });

    expect(cbse).toBeDefined();
    expect(kt).toBeDefined();
    expect(cbse?.jurisdiction).toBe('CENTRAL');
    expect(kt?.jurisdiction).toBe('STATE');
    expect(cbse?.id).not.toBe(kt?.id);
  });

  it('Publishers (NCERT, KTBS) and Authorities (DSERT) are distinct from Education Boards', async () => {
    const ktbsPublisher = await prisma.textbookPublisher.findUnique({ where: { id: 'KTBS' } });
    const dsertAuthority = await prisma.curriculumAuthority.findUnique({ where: { id: 'DSERT_KARNATAKA' } });

    expect(ktbsPublisher).toBeDefined();
    expect(dsertAuthority).toBeDefined();

    // Verify they are not mixed into the EducationBoard table
    const boardAsPublisher = await prisma.educationBoard.findUnique({ where: { id: 'KTBS' } });
    expect(boardAsPublisher).toBeNull();
  });

  it('A curriculum version uniquely identifies board, framework, level, subject, academic year, and medium', async () => {
    const version = await curriculumService.createCurriculumVersion({
      boardId: 'CBSE',
      frameworkId: 'NCF_SE_2023',
      levelId: 'GRADE_6',
      subjectId: 'SCIENCE',
      academicYear: '2026-2027',
      medium: 'en',
      versionLabel: '2026-27.v1',
      status: 'VERIFIED',
      sourceReferenceUrl: 'https://ncert.nic.in/textbook.php',
    });

    expect(version.academicYear).toBe('2026-2027');
    expect(version.medium).toBe('en');
    expect(version.status).toBe('VERIFIED');
    expect(version.boardId).toBe('CBSE');
  });

  it('Different textbook editions can exist for the same subject and grade across publication years or mediums', async () => {
    const textbook = await curriculumService.createTextbook({
      publisherId: 'NCERT_PUB',
      subjectId: 'SCIENCE',
      levelId: 'GRADE_6',
      canonicalTitle: 'Curiosity - Science Grade 6',
      isbn: '978-93-5292-000-1',
    });

    // 2024 English Edition
    const edition2024En = await curriculumService.createTextbookEdition({
      textbookId: textbook.id,
      editionNumber: 1,
      publicationYear: 2024,
      medium: 'en',
      titleInLanguage: 'Curiosity - Textbook for Science Grade 6',
      status: 'VERIFIED',
      isComplete: true,
      totalChapters: 12,
    });

    // 2026 Revised Hindi Edition
    const edition2026Hi = await curriculumService.createTextbookEdition({
      textbookId: textbook.id,
      editionNumber: 2,
      publicationYear: 2026,
      medium: 'hi',
      titleInLanguage: 'जिज्ञासा - कक्षा 6 के लिए विज्ञान पाठ्यपुस्तक',
      status: 'PENDING_VERIFICATION',
      isComplete: false,
      totalChapters: 12,
    });

    expect(edition2024En.id).not.toBe(edition2026Hi.id);
    expect(edition2024En.publicationYear).toBe(2024);
    expect(edition2026Hi.publicationYear).toBe(2026);
    expect(edition2024En.medium).toBe('en');
    expect(edition2026Hi.medium).toBe('hi');
  });

  it('A pending curriculum edition does NOT get treated as verified', async () => {
    const pendingEdition = await prisma.textbookEdition.findFirst({
      where: { status: 'PENDING_VERIFICATION' },
    });

    expect(pendingEdition).toBeDefined();
    expect(pendingEdition?.status).toBe('PENDING_VERIFICATION');
    expect(pendingEdition?.status).not.toBe('VERIFIED');
    expect(pendingEdition?.status).not.toBe('PUBLISHED');
  });
});
