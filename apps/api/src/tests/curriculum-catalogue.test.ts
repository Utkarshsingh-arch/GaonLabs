import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { prisma, disconnectDatabase } from '../shared/database/prisma';
import { runCurriculumSeed } from '../modules/curriculum/curriculum.seed';
import { curriculumService } from '../modules/curriculum/curriculum.service';
import { identityService } from '../modules/identity/identity.service';

describe('Curriculum Ingestion, Catalogue & Student Resolution', () => {
  const app = createApp();

  let studentAId: string;
  let studentBId: string;

  beforeAll(async () => {
    // 1. Ingest curriculum catalogue
    await runCurriculumSeed({ dryRun: false });

    // 2. Setup Student A (CBSE, Grade 8, English, 2026-2027)
    const accountA = await identityService.createAccount({
      loginIdentifier: `student_a_${Date.now()}`,
      displayName: 'Aarav Sharma',
      accountType: 'LEARNER',
      status: 'ACTIVATED',
      preferredLanguage: 'en',
    });
    studentAId = accountA.personId;

    await prisma.academicEnrollment.create({
      data: {
        learnerPersonId: studentAId,
        boardId: 'CBSE',
        academicYear: '2026-2027',
        officialGrade: 8,
        primaryMedium: 'en',
        status: 'ACTIVE',
      },
    });

    // 3. Setup Student B (Karnataka State Board, Grade 7, Kannada, 2026-2027)
    const accountB = await identityService.createAccount({
      loginIdentifier: `student_b_${Date.now()}`,
      displayName: 'Ananya Gowda',
      accountType: 'LEARNER',
      status: 'ACTIVATED',
      preferredLanguage: 'kn',
    });
    studentBId = accountB.personId;

    await prisma.academicEnrollment.create({
      data: {
        learnerPersonId: studentBId,
        boardId: 'KARNATAKA_STATE_BOARD',
        academicYear: '2026-2027',
        officialGrade: 7,
        primaryMedium: 'kn',
        status: 'ACTIVE',
      },
    });
  }, 60000);

  afterAll(async () => {
    // Clean up test students (delete Person before Account to respect foreign key constraint)
    if (studentAId) {
      await prisma.academicEnrollment.deleteMany({ where: { learnerPersonId: studentAId } });
      const personA = await prisma.person.findUnique({ where: { id: studentAId } });
      if (personA) {
        await prisma.person.delete({ where: { id: studentAId } });
        await prisma.account.delete({ where: { id: personA.accountId } });
      }
    }
    if (studentBId) {
      await prisma.academicEnrollment.deleteMany({ where: { learnerPersonId: studentBId } });
      const personB = await prisma.person.findUnique({ where: { id: studentBId } });
      if (personB) {
        await prisma.person.delete({ where: { id: studentBId } });
        await prisma.account.delete({ where: { id: personB.accountId } });
      }
    }
    await disconnectDatabase();
  });

  // --------------------------------------------------------------------------
  // 1. Ingestion & Idempotency
  // --------------------------------------------------------------------------
  it('Curriculum seed is strictly idempotent and does not duplicate records when re-run', async () => {
    const boardsBefore = await prisma.educationBoard.count();
    const frameworksBefore = await prisma.curriculumFramework.count();
    const publishersBefore = await prisma.textbookPublisher.count();
    const textbooksBefore = await prisma.textbook.count();
    const editionsBefore = await prisma.textbookEdition.count();
    const chaptersBefore = await prisma.chapter.count();

    // Re-run seed immediately
    const seedResult = await runCurriculumSeed({ dryRun: false });
    expect(seedResult.errors).toHaveLength(0);

    const boardsAfter = await prisma.educationBoard.count();
    const frameworksAfter = await prisma.curriculumFramework.count();
    const publishersAfter = await prisma.textbookPublisher.count();
    const textbooksAfter = await prisma.textbook.count();
    const editionsAfter = await prisma.textbookEdition.count();
    const chaptersAfter = await prisma.chapter.count();

    // Counts must remain strictly identical
    expect(boardsAfter).toBe(boardsBefore);
    expect(frameworksAfter).toBe(frameworksBefore);
    expect(publishersAfter).toBe(publishersBefore);
    expect(textbooksAfter).toBe(textbooksBefore);
    expect(editionsAfter).toBe(editionsBefore);
    expect(chaptersAfter).toBe(chaptersBefore);

    // Baseline catalog expectations
    expect(boardsAfter).toBe(2);
    expect(frameworksAfter).toBeGreaterThanOrEqual(2);
    expect(publishersAfter).toBe(2);
    expect(textbooksAfter).toBeGreaterThanOrEqual(12);
    expect(editionsAfter).toBeGreaterThanOrEqual(18);
    expect(chaptersAfter).toBeGreaterThanOrEqual(261);
  }, 60000);

  // --------------------------------------------------------------------------
  // 2. Read-Only REST Endpoints
  // --------------------------------------------------------------------------
  it('GET /api/v1/curriculum/boards returns all registered education boards', async () => {
    const res = await request(app).get('/api/v1/curriculum/boards');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(2);

    const boardIds = res.body.data.map((b: any) => b.id);
    expect(boardIds).toContain('CBSE');
    expect(boardIds).toContain('KARNATAKA_STATE_BOARD');
  });

  it('GET /api/v1/curriculum/boards/:boardId/grades returns middle school grades 6, 7, 8', async () => {
    const res = await request(app).get('/api/v1/curriculum/boards/CBSE/grades');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(3);

    const numericGrades = res.body.data.map((g: any) => g.numericGrade);
    expect(numericGrades).toEqual([6, 7, 8]);
  });

  it('GET /api/v1/curriculum/grades/:gradeId/subjects returns Mathematics and Science', async () => {
    const res = await request(app).get('/api/v1/curriculum/grades/GRADE_6/subjects?boardId=CBSE');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(2);

    const subjectIds = res.body.data.map((s: any) => s.id);
    expect(subjectIds).toContain('SCIENCE');
    expect(subjectIds).toContain('MATHEMATICS');
  });

  it('GET /api/v1/curriculum/catalogue filters by board, grade, and medium accurately', async () => {
    // A: CBSE Grade 6
    const resCbse = await request(app).get('/api/v1/curriculum/catalogue?boardId=CBSE&grade=6');
    expect(resCbse.status).toBe(200);
    expect(resCbse.body.success).toBe(true);
    expect(resCbse.body.count).toBe(2); // Science & Math

    // B: Karnataka State Board in Kannada medium
    const resKtbsKn = await request(app).get('/api/v1/curriculum/catalogue?boardId=KARNATAKA_STATE_BOARD&medium=kn');
    expect(resKtbsKn.status).toBe(200);
    expect(resKtbsKn.body.success).toBe(true);
    expect(resKtbsKn.body.count).toBe(6); // 3 grades x 2 subjects

    // C: Total catalogue count
    const resAll = await request(app).get('/api/v1/curriculum/catalogue');
    expect(resAll.status).toBe(200);
    expect(resAll.body.count).toBe(18);
  });

  it('GET /api/v1/curriculum/textbooks/:textbookId returns textbook details and editions', async () => {
    const textbook = await prisma.textbook.findFirst({
      where: { canonicalTitle: 'Curiosity - Science Grade 6' },
    });
    expect(textbook).toBeDefined();

    const res = await request(app).get(`/api/v1/curriculum/textbooks/${textbook!.id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.canonicalTitle).toBe('Curiosity - Science Grade 6');
    expect(res.body.data.publisher.code).toBe('NCERT_PUB');
    expect(res.body.data.editions.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/v1/curriculum/editions/:editionId/chapters returns ordered chapters with titles', async () => {
    const edition = await prisma.textbookEdition.findFirst({
      where: { titleInLanguage: 'Curiosity - Textbook for Science Grade 6' },
    });
    expect(edition).toBeDefined();

    const res = await request(app).get(`/api/v1/curriculum/editions/${edition!.id}/chapters`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(12);

    expect(res.body.data[0].chapterNumber).toBe(1);
    expect(res.body.data[0].title).toBe('The Wonderful World of Science');
    expect(res.body.data[11].chapterNumber).toBe(12);
    expect(res.body.data[11].title).toBe('Beyond Earth');
  });

  // --------------------------------------------------------------------------
  // 3. Student Curriculum Resolution (Student A & Student B)
  // --------------------------------------------------------------------------
  it('Resolves Student A curriculum: CBSE -> Class 8 -> Mathematics & Science -> English -> 2026-27', async () => {
    const resolution = await curriculumService.resolveStudentCurriculum(studentAId);

    expect(resolution.learnerId).toBe(studentAId);
    expect(resolution.board.id).toBe('CBSE');
    expect(resolution.board.jurisdiction).toBe('CENTRAL');
    expect(resolution.grade).toBe(8);
    expect(resolution.levelId).toBe('GRADE_8');
    expect(resolution.academicYear).toBe('2026-2027');
    expect(resolution.primaryMedium).toBe('en');

    expect(resolution.subjects).toHaveLength(2);

    const math = resolution.subjects.find((s) => s.subjectId === 'MATHEMATICS');
    const science = resolution.subjects.find((s) => s.subjectId === 'SCIENCE');

    expect(math).toBeDefined();
    expect(science).toBeDefined();

    // Verify Mathematics: 13 chapters
    expect(math!.textbooks).toHaveLength(1);
    expect(math!.textbooks[0].canonicalTitle).toBe('Mathematics - Grade 8');
    expect(math!.textbooks[0].totalChapters).toBe(13);
    expect(math!.textbooks[0].chapters).toHaveLength(13);
    expect(math!.textbooks[0].chapters[0].title).toBe('Rational Numbers');
    expect(math!.textbooks[0].chapters[12].title).toBe('Introduction to Graphs');

    // Verify Science: 13 chapters (Curiosity Grade 8)
    expect(science!.textbooks).toHaveLength(1);
    expect(science!.textbooks[0].canonicalTitle).toBe('Curiosity - Science Grade 8');
    expect(science!.textbooks[0].totalChapters).toBe(13);
    expect(science!.textbooks[0].chapters).toHaveLength(13);
    expect(science!.textbooks[0].chapters[0].title).toBe('Exploring the Investigative World of Science');
    expect(science!.textbooks[0].chapters[12].title).toBe('Our Home: Earth, a Unique Life-Sustaining Planet');
  });

  it('Resolves Student B curriculum: Karnataka State Board -> Class 7 -> Mathematics & Science -> Kannada -> 2026-27', async () => {
    const resolution = await curriculumService.resolveStudentCurriculum(studentBId);

    expect(resolution.learnerId).toBe(studentBId);
    expect(resolution.board.id).toBe('KARNATAKA_STATE_BOARD');
    expect(resolution.board.jurisdiction).toBe('STATE');
    expect(resolution.grade).toBe(7);
    expect(resolution.levelId).toBe('GRADE_7');
    expect(resolution.academicYear).toBe('2026-2027');
    expect(resolution.primaryMedium).toBe('kn');

    expect(resolution.subjects).toHaveLength(2);

    const science = resolution.subjects.find((s) => s.subjectId === 'SCIENCE');
    const math = resolution.subjects.find((s) => s.subjectId === 'MATHEMATICS');

    expect(science).toBeDefined();
    expect(math).toBeDefined();

    // Verify Science (Kannada Medium): 18 chapters
    expect(science!.textbooks).toHaveLength(1);
    expect(science!.textbooks[0].publisherName).toBe('Karnataka Textbook Society');
    expect(science!.textbooks[0].medium).toBe('kn');
    expect(science!.textbooks[0].titleInLanguage).toBe('ವಿಜ್ಞಾನ - 7ನೇ ತರಗತಿ ಪಠ್ಯಪುಸ್ತಕ');
    expect(science!.textbooks[0].totalChapters).toBe(18);
    expect(science!.textbooks[0].chapters).toHaveLength(18);
    expect(science!.textbooks[0].chapters[0].title).toBe('ಸಸ್ಯಗಳಲ್ಲಿ ಪೋಷಣೆ');
    expect(science!.textbooks[0].chapters[17].title).toBe('ತ್ಯಾಜ್ಯ ನೀರು ನಿರ್ವಹಣೆ');

    // Verify Mathematics (Kannada Medium): 15 chapters
    expect(math!.textbooks).toHaveLength(1);
    expect(math!.textbooks[0].publisherName).toBe('Karnataka Textbook Society');
    expect(math!.textbooks[0].medium).toBe('kn');
    expect(math!.textbooks[0].titleInLanguage).toBe('ಗಣಿತ - 7ನೇ ತರಗತಿ ಪಠ್ಯಪುಸ್ತಕ');
    expect(math!.textbooks[0].totalChapters).toBe(15);
    expect(math!.textbooks[0].chapters).toHaveLength(15);
    expect(math!.textbooks[0].chapters[0].title).toBe('ಪೂರ್ಣಾಂಕಗಳು');
    expect(math!.textbooks[0].chapters[14].title).toBe('ಘನಾಕೃತಿಗಳ ದೃಶ್ಯೀಕರಣ');
  });

  it('GET /api/v1/curriculum/resolve/:learnerId exposes student resolution over HTTP', async () => {
    const resA = await request(app).get(`/api/v1/curriculum/resolve/${studentAId}`);
    expect(resA.status).toBe(200);
    expect(resA.body.success).toBe(true);
    expect(resA.body.data.board.id).toBe('CBSE');
    expect(resA.body.data.grade).toBe(8);
    expect(resA.body.data.subjects).toHaveLength(2);

    const resB = await request(app).get(`/api/v1/curriculum/resolve/${studentBId}`);
    expect(resB.status).toBe(200);
    expect(resB.body.success).toBe(true);
    expect(resB.body.data.board.id).toBe('KARNATAKA_STATE_BOARD');
    expect(resB.body.data.grade).toBe(7);
    expect(resB.body.data.primaryMedium).toBe('kn');
    expect(resB.body.data.subjects).toHaveLength(2);
  });
});
