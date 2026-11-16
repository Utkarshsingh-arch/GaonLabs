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
  errors: string[];
}

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

  for (const filePath of jsonFiles) {
    try {
      const rawContent = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(rawContent);

      const { manifest, chapters } = data;
      if (!manifest || !Array.isArray(chapters)) {
        throw new Error(`Invalid curriculum format in: ${filePath}`);
      }

      uniqueBoards.add(manifest.boardId);
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
        } else {
          result.pendingChaptersCount++;
        }
      }

      if (!dryRun) {
        // 1. Ensure Base Programme, Level, and Subject exist
        await prisma.programme.upsert({
          where: { id: 'K12_GENERAL' },
          update: { name: 'K-12 School Education' },
          create: { id: 'K12_GENERAL', code: 'K12', name: 'K-12 School Education' },
        });

        await prisma.level.upsert({
          where: { programmeId_numericGrade: { programmeId: 'K12_GENERAL', numericGrade: manifest.grade } },
          update: { stage: 'MIDDLE', name: `Grade ${manifest.grade}` },
          create: {
            id: manifest.levelId,
            programmeId: 'K12_GENERAL',
            numericGrade: manifest.grade,
            stage: 'MIDDLE',
            name: `Grade ${manifest.grade}`,
          },
        });

        await prisma.subject.upsert({
          where: { id: manifest.subjectId },
          update: { name: manifest.subjectName, stemPillar: manifest.stemPillar },
          create: {
            id: manifest.subjectId,
            code: manifest.subjectId.substring(0, 4).toUpperCase(),
            name: manifest.subjectName,
            stemPillar: manifest.stemPillar,
          },
        });

        // 2. Ensure EducationBoard exists
        await curriculumService.createBoard({
          id: manifest.boardId,
          code: manifest.boardId,
          name: manifest.boardName,
          jurisdiction: manifest.boardId === 'CBSE' ? 'CENTRAL' : 'STATE',
          websiteUrl: manifest.boardId === 'CBSE' ? 'https://cbse.gov.in' : 'https://kseab.karnataka.gov.in',
        });

        // 3. Ensure CurriculumFramework exists
        await curriculumService.createFramework({
          id: manifest.frameworkId,
          code: manifest.frameworkId,
          name: manifest.frameworkName,
          adoptingAuthority: manifest.authorityId,
          yearIntroduced: manifest.frameworkId.includes('2023') ? 2023 : 2024,
        });

        // 4. Ensure CurriculumAuthority exists
        await curriculumService.createAuthority({
          id: manifest.authorityId,
          code: manifest.authorityId,
          name: manifest.authorityName,
          type: manifest.authorityId === 'NCERT' ? 'NATIONAL_CURRICULAR_BODY' : 'STATE_CURRICULAR_BODY',
        });

        // 5. Ensure TextbookPublisher exists
        await curriculumService.createPublisher({
          id: manifest.publisherId,
          code: manifest.publisherId,
          name: manifest.publisherName,
          jurisdiction: manifest.publisherId === 'NCERT_PUB' ? 'NATIONAL' : 'KARNATAKA',
          officialCatalogUrl: manifest.publisherId === 'NCERT_PUB' ? 'https://ncert.nic.in/textbook.php' : 'https://textbooks.karnataka.gov.in/',
        });

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

        // 8. Upsert CurriculumVersion
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

        console.log(` ✓ Ingested: [${manifest.boardId}] Grade ${manifest.grade} ${manifest.subjectName} (${manifest.medium.toUpperCase()}) — ${chapters.length} chapters.`);
      } else {
        console.log(` [DRY RUN] Would ingest: [${manifest.boardId}] Grade ${manifest.grade} ${manifest.subjectName} (${manifest.medium.toUpperCase()}) — ${chapters.length} chapters.`);
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
