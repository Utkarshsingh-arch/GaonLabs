import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { prisma, disconnectDatabase } from '../shared/database/prisma';
import { curriculumService } from '../modules/curriculum/curriculum.service';

describe('NCERT STEM Curriculum Catalogue (Classes 1–12)', () => {
  const app = createApp();

  beforeAll(async () => {
    // Database is already seeded by the test runner or previous migration
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  // --------------------------------------------------------------------------
  // 1. Class Representation (Classes 1 to 12)
  // --------------------------------------------------------------------------
  it('All 12 classes (Grades 1 to 12) are represented in Level with appropriate stages', async () => {
    const levels = await prisma.level.findMany({
      orderBy: { numericGrade: 'asc' },
    });

    const grades = levels.map((l) => l.numericGrade);
    for (let g = 1; g <= 12; g++) {
      expect(grades).toContain(g);
    }

    // Verify stage classifications
    const g1 = levels.find((l) => l.numericGrade === 1);
    const g4 = levels.find((l) => l.numericGrade === 4);
    const g7 = levels.find((l) => l.numericGrade === 7);
    const g10 = levels.find((l) => l.numericGrade === 10);
    const g12 = levels.find((l) => l.numericGrade === 12);

    expect(g1?.stage).toBe('FOUNDATIONAL');
    expect(g4?.stage).toBe('PREPARATORY');
    expect(g7?.stage).toBe('MIDDLE');
    expect(g10?.stage).toBe('SECONDARY');
    expect(g12?.stage).toBe('HIGHER_SECONDARY');
  });

  // --------------------------------------------------------------------------
  // 2. Mathematics Coverage Across All 12 Grades
  // --------------------------------------------------------------------------
  it('Mathematics catalogue is available for all grades 1 through 12', async () => {
    for (let grade = 1; grade <= 12; grade++) {
      const mathBooks = await prisma.textbook.findMany({
        where: {
          publisherId: 'NCERT_PUB',
          subjectId: 'MATHEMATICS',
          level: { numericGrade: grade },
        },
        include: { editions: true },
      });

      expect(mathBooks.length).toBeGreaterThanOrEqual(1);
      const editions = mathBooks.flatMap((b) => b.editions);
      expect(editions.length).toBeGreaterThanOrEqual(1);
    }
  });

  // --------------------------------------------------------------------------
  // 3. Environmental and Science Subject Classification
  // --------------------------------------------------------------------------
  it('Grades 1–2 do not have fabricated standalone science books', async () => {
    const g1Science = await prisma.textbook.findMany({
      where: {
        publisherId: 'NCERT_PUB',
        subjectId: 'SCIENCE',
        level: { numericGrade: { in: [1, 2] } },
      },
    });

    expect(g1Science).toHaveLength(0);
  });

  it('Grades 3–5 feature The World Around Us / Environmental Studies under SCIENCE pillar', async () => {
    const ewsSubject = await prisma.subject.findUnique({
      where: { id: 'THE_WORLD_AROUND_US' },
    });
    expect(ewsSubject).toBeDefined();
    expect(ewsSubject?.stemPillar).toBe('SCIENCE');

    const ewsBooks = await prisma.textbook.findMany({
      where: {
        publisherId: 'NCERT_PUB',
        subjectId: 'THE_WORLD_AROUND_US',
      },
    });
    expect(ewsBooks.length).toBeGreaterThanOrEqual(3);
  });

  it('Grades 6–10 feature Integrated Science under SCIENCE pillar', async () => {
    for (let grade = 6; grade <= 10; grade++) {
      const scienceBooks = await prisma.textbook.findMany({
        where: {
          publisherId: 'NCERT_PUB',
          subjectId: 'SCIENCE',
          level: { numericGrade: grade },
        },
      });
      expect(scienceBooks.length).toBeGreaterThanOrEqual(1);
    }
  });

  // --------------------------------------------------------------------------
  // 4. Classes 11–12 Multi-Volume & Specialized STEM Subjects
  // --------------------------------------------------------------------------
  it('Classes 11–12 support multi-volume textbooks (Part I and Part II)', async () => {
    // Class 11 Physics Part I and Part II
    const c11PhyP1 = await prisma.textbook.findFirst({
      where: { canonicalTitle: 'Physics Part I - Class 11', publisherId: 'NCERT_PUB' },
      include: { editions: { include: { chapters: true } } },
    });
    const c11PhyP2 = await prisma.textbook.findFirst({
      where: { canonicalTitle: 'Physics Part II - Class 11', publisherId: 'NCERT_PUB' },
      include: { editions: { include: { chapters: true } } },
    });
    expect(c11PhyP1).toBeDefined();
    expect(c11PhyP2).toBeDefined();
    expect(c11PhyP1?.id).not.toBe(c11PhyP2?.id);

    // Class 12 Mathematics Part I and Part II
    const c12MathP1 = await prisma.textbook.findFirst({
      where: { canonicalTitle: 'Mathematics Part I - Class 12', publisherId: 'NCERT_PUB' },
      include: { editions: { include: { chapters: true } } },
    });
    const c12MathP2 = await prisma.textbook.findFirst({
      where: { canonicalTitle: 'Mathematics Part II - Class 12', publisherId: 'NCERT_PUB' },
      include: { editions: { include: { chapters: true } } },
    });
    expect(c12MathP1).toBeDefined();
    expect(c12MathP2).toBeDefined();

    // Class 11 Chemistry Part I and Part II
    const c11ChemP1 = await prisma.textbook.findFirst({
      where: { canonicalTitle: 'Chemistry Part I - Class 11', publisherId: 'NCERT_PUB' },
    });
    const c11ChemP2 = await prisma.textbook.findFirst({
      where: { canonicalTitle: 'Chemistry Part II - Class 11', publisherId: 'NCERT_PUB' },
    });
    expect(c11ChemP1).toBeDefined();
    expect(c11ChemP2).toBeDefined();
  });

  it('Classes 11–12 feature Computing & Advanced STEM (Computer Science, IP, Biotechnology)', async () => {
    const cs = await prisma.textbook.findFirst({
      where: { subjectId: 'COMPUTER_SCIENCE', level: { numericGrade: 11 } },
    });
    const ip = await prisma.textbook.findFirst({
      where: { subjectId: 'INFORMATICS_PRACTICES', level: { numericGrade: 12 } },
    });
    const bio = await prisma.textbook.findFirst({
      where: { subjectId: 'BIOLOGY', level: { numericGrade: 11 } },
    });
    const biotech = await prisma.textbook.findFirst({
      where: { subjectId: 'BIOTECHNOLOGY', level: { numericGrade: 11 } },
    });

    expect(cs).toBeDefined();
    expect(ip).toBeDefined();
    expect(bio).toBeDefined();
    expect(biotech).toBeDefined();
  });

  // --------------------------------------------------------------------------
  // 5. NCERT and Board Boundaries
  // --------------------------------------------------------------------------
  it('NCERT is NOT registered as a fake EducationBoard; it is a Publisher and Authority', async () => {
    const ncertBoard = await prisma.educationBoard.findUnique({
      where: { id: 'NCERT' },
    });
    expect(ncertBoard).toBeNull();

    const ncertAuthority = await prisma.curriculumAuthority.findUnique({
      where: { id: 'NCERT' },
    });
    expect(ncertAuthority).toBeDefined();
    expect(ncertAuthority?.type).toBe('NATIONAL_CURRICULAR_BODY');

    const ncertPublisher = await prisma.textbookPublisher.findUnique({
      where: { id: 'NCERT_PUB' },
    });
    expect(ncertPublisher).toBeDefined();
    expect(ncertPublisher?.jurisdiction).toBe('NATIONAL');
  });

  it('Karnataka State Board and KTBS records are completely preserved and unmixed', async () => {
    const ktbsPublisher = await prisma.textbookPublisher.findUnique({
      where: { id: 'KTBS' },
    });
    expect(ktbsPublisher).toBeDefined();

    const ktbsTextbooks = await prisma.textbook.findMany({
      where: { publisherId: 'KTBS' },
      include: { editions: true },
    });
    expect(ktbsTextbooks.length).toBe(6); // Grades 6, 7, 8 x Math, Science

    // Verify Karnataka editions include Kannada medium
    const kannadaEditions = await prisma.textbookEdition.findMany({
      where: {
        medium: 'kn',
        textbook: { publisherId: 'KTBS' },
      },
    });
    expect(kannadaEditions.length).toBe(6);
  });

  // --------------------------------------------------------------------------
  // 6. Language Coverage & Editions
  // --------------------------------------------------------------------------
  it('Distinct language editions exist for English, Hindi, and Urdu under the same canonical textbook', async () => {
    const g1Joyful = await prisma.textbook.findFirst({
      where: { canonicalTitle: 'Joyful Mathematics - Grade 1' },
      include: { editions: true },
    });

    expect(g1Joyful).toBeDefined();
    const mediums = g1Joyful!.editions.map((e) => e.medium);
    expect(mediums).toContain('en');
    expect(mediums).toContain('hi');
    expect(mediums).toContain('ur');
  });

  // --------------------------------------------------------------------------
  // 7. Edition Status: Verified, Archived, Pending Verification
  // --------------------------------------------------------------------------
  it('Archived legacy editions retain ARCHIVED status and do not overwrite current editions', async () => {
    const archivedMathMagic = await prisma.textbookEdition.findFirst({
      where: {
        status: 'ARCHIVED',
        textbook: { canonicalTitle: 'Math-Magic - Grade 1' },
      },
    });
    expect(archivedMathMagic).toBeDefined();
    expect(archivedMathMagic?.status).toBe('ARCHIVED');

    // Current edition is verified
    const currentJoyful = await prisma.textbookEdition.findFirst({
      where: {
        medium: 'en',
        textbook: { canonicalTitle: 'Joyful Mathematics - Grade 1' },
      },
    });
    expect(currentJoyful?.status).toBe('VERIFIED');
  });

  it('Pending preview and unverified records are marked PENDING_VERIFICATION', async () => {
    const appliedMath = await prisma.textbookEdition.findFirst({
      where: {
        textbook: { subjectId: 'APPLIED_MATHEMATICS' },
      },
    });
    expect(appliedMath).toBeDefined();
    expect(appliedMath?.status).toBe('PENDING_VERIFICATION');

    const g8Preview = await prisma.textbookEdition.findFirst({
      where: {
        textbook: { canonicalTitle: 'Ganita Prakash - Grade 8' },
      },
    });
    expect(g8Preview).toBeDefined();
    expect(g8Preview?.status).toBe('PENDING_VERIFICATION');
  });

  // --------------------------------------------------------------------------
  // 8. REST API: National Reference Catalogue & Publishers
  // --------------------------------------------------------------------------
  it('GET /api/v1/curriculum/publishers returns NCERT and KTBS', async () => {
    const res = await request(app).get('/api/v1/curriculum/publishers');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(2);

    const ids = res.body.data.map((p: any) => p.id);
    expect(ids).toContain('NCERT_PUB');
    expect(ids).toContain('KTBS');
  });

  it('GET /api/v1/curriculum/national-catalogue returns NCERT textbooks filtered by grade and subject', async () => {
    const res = await request(app).get('/api/v1/curriculum/national-catalogue?grade=11&subjectId=PHYSICS');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(2); // Part I and Part II

    const titles = res.body.data.map((b: any) => b.canonicalTitle);
    expect(titles).toContain('Physics Part I - Class 11');
    expect(titles).toContain('Physics Part II - Class 11');
  });

  it('GET /api/v1/curriculum/publishers/:publisherId/textbooks returns textbooks for that publisher', async () => {
    const res = await request(app).get('/api/v1/curriculum/publishers/NCERT_PUB/textbooks?grade=1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThanOrEqual(1);

    for (const book of res.body.data) {
      expect(book.publisherId).toBe('NCERT_PUB');
      expect(book.level.numericGrade).toBe(1);
    }
  });
});
