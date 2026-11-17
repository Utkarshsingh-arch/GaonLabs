import fs from 'fs';
import path from 'path';
import { prisma, disconnectDatabase } from '../../shared/database/prisma';
import { curriculumService } from './curriculum.service';

export interface CurriculumSeedResult {
  dryRun: boolean;
  filesProcessed: number;
  boardsCount: number;
  frameworksCount: number;
  publishersCount: number;
  textbooksCount: number;
  editionsCount: number;
  chaptersCount: number;
  verifiedChaptersCount: number;
  pendingChaptersCount: number;
  archivedChaptersCount: number;
  boardVersionsCount: number;
  errors: string[];
}

function getGradeStage(grade: number): string {
  if (grade <= 2) return 'FOUNDATIONAL';
  if (grade <= 5) return 'PREPARATORY';
  if (grade <= 8) return 'MIDDLE';
  if (grade <= 10) return 'SECONDARY';
  return 'HIGHER_SECONDARY';
}

const SUBJECT_SHORT_CODES: Record<string, string> = {
  MATHEMATICS: 'MATH',
  SCIENCE: 'SCI',
  THE_WORLD_AROUND_US: 'WWAU',
  PHYSICS: 'PHYS',
  CHEMISTRY: 'CHEM',
  BIOLOGY: 'BIOL',
  COMPUTER_SCIENCE: 'CS',
  INFORMATICS_PRACTICES: 'IP',
  BIOTECHNOLOGY: 'BIOT',
  APPLIED_MATHEMATICS: 'AMAT',
};

export async function runCurriculumSeed(options: { dryRun?: boolean; contentDir?: string } = {}): Promise<CurriculumSeedResult> {
  const dryRun = options.dryRun ?? process.argv.includes('--dry-run');
  const baseDir = options.contentDir ?? path.resolve(process.cwd(), '../../content/curriculum');

  const resolvedBaseDir = fs.existsSync(baseDir)
    ? baseDir
    : path.resolve(__dirname, '../../../../../content/curriculum');

  console.log(`\n======================================================`);
  console.log(` 🌱 GAONLAB CURRICULUM SEEDER ${dryRun ? ' [DRY-RUN MODE]' : ' [DATABASE WRITE]'}`);
  console.log(` 📂 Source Directory: ${resolvedBaseDir}`);
  console.log(`======================================================\n`);

  const result: CurriculumSeedResult = {
    dryRun,
    filesProcessed: 0,
    boardsCount: 0,
    frameworksCount: 0,
    publishersCount: 0,
    textbooksCount: 0,
    editionsCount: 0,
    chaptersCount: 0,
    verifiedChaptersCount: 0,
    pendingChaptersCount: 0,
    archivedChaptersCount: 0,
    boardVersionsCount: 0,
    errors: [],
  };

  if (!fs.existsSync(resolvedBaseDir)) {
    const errorMsg = `Curriculum content directory not found at: ${resolvedBaseDir}`;
    console.error(`❌ ${errorMsg}`);
    result.errors.push(errorMsg);
    return result;
  }

  // Find all .json files recursively
  const findJsonFiles = (dir: string): string[] => {
    let files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(findJsonFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        files.push(fullPath);
      }
    }
    return files;
  };

  const jsonFiles = findJsonFiles(resolvedBaseDir);
  console.log(`Found ${jsonFiles.length} curriculum catalogue file(s) to process.\n`);

  const uniqueBoards = new Set<string>();
  const uniqueFrameworks = new Set<string>();
  const uniquePublishers = new Set<string>();
  const uniqueTextbooks = new Set<string>();
  const uniqueEditions = new Set<string>();

  const seededProgrammes = new Set<string>();
  const seededLevels = new Set<string>();
  const seededSubjects = new Set<string>();
  const seededBoards = new Set<string>();
  const seededFrameworks = new Set<string>();
  const seededAuthorities = new Set<string>();
  const seededPublishers = new Set<string>();

  for (const filePath of jsonFiles) {
    try {
      const rawContent = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(rawContent);

      const { manifest, chapters } = data;
      if (!manifest || !Array.isArray(chapters)) {
        throw new Error(`Invalid curriculum format in: ${filePath}`);
      }

      if (manifest.boardId) {
        uniqueBoards.add(manifest.boardId);
      }
      uniqueFrameworks.add(manifest.frameworkId);
      uniquePublishers.add(manifest.publisherId);

      const textbookKey = `${manifest.publisherId}::${manifest.subjectId}::${manifest.levelId}::${manifest.canonicalTitle}`;
      uniqueTextbooks.add(textbookKey);

      const editionKey = `${textbookKey}::${manifest.editionNumber}::${manifest.medium}`;
      uniqueEditions.add(editionKey);

      result.filesProcessed++;
      result.chaptersCount += chapters.length;

      for (const ch of chapters) {
        if (ch.status === 'VERIFIED') {
          result.verifiedChaptersCount++;
        } else if (ch.status === 'ARCHIVED') {
          result.archivedChaptersCount++;
        } else {
          result.pendingChaptersCount++;
        }
      }

      if (!dryRun) {
        // 1. Ensure Base Programme, Level, and Subject exist
        if (!seededProgrammes.has('K12_GENERAL')) {
          await prisma.programme.upsert({
            where: { id: 'K12_GENERAL' },
            update: { name: 'K-12 School Education' },
            create: { id: 'K12_GENERAL', code: 'K12', name: 'K-12 School Education' },
          });
          seededProgrammes.add('K12_GENERAL');
        }

        if (!seededLevels.has(manifest.levelId)) {
          const stage = getGradeStage(manifest.grade);
          await prisma.level.upsert({
            where: { programmeId_numericGrade: { programmeId: 'K12_GENERAL', numericGrade: manifest.grade } },
            update: { stage, name: `Grade ${manifest.grade}` },
            create: {
              id: manifest.levelId,
              programmeId: 'K12_GENERAL',
              numericGrade: manifest.grade,
              stage,
              name: `Grade ${manifest.grade}`,
            },
          });
          seededLevels.add(manifest.levelId);
        }

        if (!seededSubjects.has(manifest.subjectId)) {
          const subjectCode = SUBJECT_SHORT_CODES[manifest.subjectId] || manifest.subjectId.substring(0, 4).toUpperCase();
          await prisma.subject.upsert({
            where: { id: manifest.subjectId },
            update: { name: manifest.subjectName, stemPillar: manifest.stemPillar },
            create: {
              id: manifest.subjectId,
              code: subjectCode,
              name: manifest.subjectName,
              stemPillar: manifest.stemPillar,
            },
          });
          seededSubjects.add(manifest.subjectId);
        }

        // 2. Ensure EducationBoard exists (only if board-specific manifest)
        if (manifest.boardId && !seededBoards.has(manifest.boardId)) {
          await curriculumService.createBoard({
            id: manifest.boardId,
            code: manifest.boardId,
            name: manifest.boardName,
            jurisdiction: manifest.boardId === 'CBSE' ? 'CENTRAL' : 'STATE',
            websiteUrl: manifest.boardId === 'CBSE' ? 'https://cbse.gov.in' : 'https://kseab.karnataka.gov.in',
          });
          seededBoards.add(manifest.boardId);
        }

        // 3. Ensure CurriculumFramework exists
        if (!seededFrameworks.has(manifest.frameworkId)) {
          await curriculumService.createFramework({
            id: manifest.frameworkId,
            code: manifest.frameworkId,
            name: manifest.frameworkName,
            adoptingAuthority: manifest.authorityId,
            yearIntroduced: manifest.frameworkId.includes('2023') ? 2023 : 2024,
          });
          seededFrameworks.add(manifest.frameworkId);
        }

        // 4. Ensure CurriculumAuthority exists
        if (!seededAuthorities.has(manifest.authorityId)) {
          await curriculumService.createAuthority({
            id: manifest.authorityId,
            code: manifest.authorityId,
            name: manifest.authorityName,
            type: manifest.authorityId === 'NCERT' ? 'NATIONAL_CURRICULAR_BODY' : 'STATE_CURRICULAR_BODY',
          });
          seededAuthorities.add(manifest.authorityId);
        }

        // 5. Ensure TextbookPublisher exists
        if (!seededPublishers.has(manifest.publisherId)) {
          await curriculumService.createPublisher({
            id: manifest.publisherId,
            code: manifest.publisherId,
            name: manifest.publisherName,
            jurisdiction: manifest.publisherId === 'NCERT_PUB' ? 'NATIONAL' : 'KARNATAKA',
            officialCatalogUrl: manifest.publisherId === 'NCERT_PUB' ? 'https://ncert.nic.in/textbook.php' : 'https://textbooks.karnataka.gov.in/',
          });
          seededPublishers.add(manifest.publisherId);
        }

        // 6. Upsert Textbook
        const textbook = await curriculumService.createTextbook({
          publisherId: manifest.publisherId,
          subjectId: manifest.subjectId,
          levelId: manifest.levelId,
          canonicalTitle: manifest.canonicalTitle,
          description: manifest.licenceNotes,
        });

        // 7. Upsert TextbookEdition
        const edition = await curriculumService.createTextbookEdition({
          textbookId: textbook.id,
          editionNumber: manifest.editionNumber || 1,
          publicationYear: manifest.publicationYear || 2026,
          medium: manifest.medium,
          titleInLanguage: manifest.titleInLanguage,
          sourceUrl: manifest.sourceUrl,
          licenceInfo: manifest.licenceNotes,
          status: manifest.verificationStatus || 'VERIFIED',
          isComplete: manifest.isComplete ?? true,
          totalChapters: chapters.length,
        });

        // 8. Upsert CurriculumVersion and link edition (only if board-specific manifest)
        if (manifest.boardId) {
          const curriculumVersion = await curriculumService.createCurriculumVersion({
            boardId: manifest.boardId,
            frameworkId: manifest.frameworkId,
            levelId: manifest.levelId,
            subjectId: manifest.subjectId,
            academicYear: manifest.academicYear,
            medium: manifest.medium,
            versionLabel: `${manifest.academicYear}.v1`,
            status: manifest.verificationStatus || 'VERIFIED',
            sourceReferenceUrl: manifest.sourceUrl,
          });

          // 9. Link TextbookEdition to CurriculumVersion
          await curriculumService.linkCurriculumTextbook(curriculumVersion.id, edition.id, true);
          result.boardVersionsCount++;
        }

        // 10. Bulk insert all Chapters (idempotent with skipDuplicates)
        const chaptersData = chapters.map((ch: any) => ({
          textbookEditionId: edition.id,
          chapterNumber: ch.chapterNumber,
          title: ch.title,
          officialCode: ch.officialCode,
          pageStart: ch.pageStart,
          pageEnd: ch.pageEnd,
          sourceUrl: ch.sourceUrl,
          status: ch.status || 'VERIFIED',
        }));

        await prisma.chapter.createMany({
          data: chaptersData,
          skipDuplicates: true,
        });

        const targetLabel = manifest.boardId ? `[${manifest.boardId}]` : '[NCERT-REF]';
        console.log(` ✓ Ingested: ${targetLabel} Grade ${manifest.grade} ${manifest.canonicalTitle} (${manifest.medium.toUpperCase()}) — ${chapters.length} chapters.`);
      } else {
        const targetLabel = manifest.boardId ? `[${manifest.boardId}]` : '[NCERT-REF]';
        console.log(` [DRY RUN] Would ingest: ${targetLabel} Grade ${manifest.grade} ${manifest.canonicalTitle} (${manifest.medium.toUpperCase()}) — ${chapters.length} chapters.`);
      }
    } catch (err: any) {
      const errorMsg = `Error ingesting ${filePath}: ${err.message}`;
      console.error(` ❌ ${errorMsg}`);
      result.errors.push(errorMsg);
    }
  }

  result.boardsCount = uniqueBoards.size;
  result.frameworksCount = uniqueFrameworks.size;
  result.publishersCount = uniquePublishers.size;
  result.textbooksCount = uniqueTextbooks.size;
  result.editionsCount = uniqueEditions.size;

  console.log(`\n======================================================`);
  console.log(` 📊 CURRICULUM SEED SUMMARY`);
  console.log(`------------------------------------------------------`);
  console.log(` Mode:                     ${dryRun ? 'DRY-RUN (Simulated)' : 'APPLIED (Database)'}`);
  console.log(` Manifest Files:           ${result.filesProcessed}`);
  console.log(` Education Boards:         ${result.boardsCount}`);
  console.log(` Curriculum Frameworks:    ${result.frameworksCount}`);
  console.log(` Textbook Publishers:      ${result.publishersCount}`);
  console.log(` Unique Textbooks:         ${result.textbooksCount}`);
  console.log(` Textbook Editions:        ${result.editionsCount}`);
  console.log(` Chapters Ingested:        ${result.chaptersCount}`);
  console.log(`   - Verified Chapters:    ${result.verifiedChaptersCount}`);
  console.log(`   - Pending Chapters:     ${result.pendingChaptersCount}`);
  console.log(`   - Archived Chapters:    ${result.archivedChaptersCount}`);
  console.log(` Board Versions Linked:    ${result.boardVersionsCount}`);
  console.log(` Total Errors / Failures:  ${result.errors.length}`);
  console.log(`======================================================\n`);

  return result;
}

// Allow direct CLI execution: tsx src/modules/curriculum/curriculum.seed.ts [--dry-run]
if (require.main === module || process.argv[1]?.includes('curriculum.seed')) {
  runCurriculumSeed()
    .then((result) => {
      if (result.errors.length > 0) {
        console.error('Curriculum seed completed with errors.');
        process.exit(1);
      }
      return disconnectDatabase().then(() => process.exit(0));
    })
    .catch(async (err) => {
      console.error('Fatal error during curriculum seed:', err);
      await disconnectDatabase();
      process.exit(1);
    });
}
