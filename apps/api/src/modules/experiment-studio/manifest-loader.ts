import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { ExperimentManifest } from '@gaonlab/shared-types';
import { logger } from '../../shared/utils/logger';
import { prisma } from '../../shared/database/prisma';

export const ExperimentCurriculumMappingSchema = z.object({
  boardId: z.string(),
  grade: z.number(),
  subjectId: z.string(),
  subjectName: z.string(),
  frameworkId: z.string().optional(),
  textbookEditionId: z.string().optional(),
  chapterId: z.string().optional(),
  chapterNumber: z.number().optional(),
  chapterTitle: z.string().optional(),
  conceptId: z.string().optional(),
});

export const VirtualApparatusSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameInLanguage: z.record(z.string()).optional(),
  type: z.string(),
  category: z.enum(['CONTAINER', 'MEASURING', 'DISPENSER', 'TEST_SURFACE', 'FORCE_APPLIER', 'SENSOR']),
  capacity: z.number().optional(),
  unit: z.string().optional(),
  icon: z.string().optional(),
});

export const ApprovedMaterialSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameInLanguage: z.record(z.string()).optional(),
  type: z.string(),
  properties: z.record(z.any()),
  colorHex: z.string().optional(),
  safetyNote: z.string().optional(),
});

export const ProgressiveHintSchema = z.object({
  tier: z.number(),
  title: z.string(),
  text: z.string(),
  textInLanguage: z.record(z.string()).optional(),
});

export const PredictionChallengeSchema = z.object({
  id: z.string(),
  question: z.string(),
  questionInLanguage: z.record(z.string()).optional(),
  context: z.string(),
  options: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      textInLanguage: z.record(z.string()).optional(),
      isHypothesis: z.boolean(),
    })
  ),
});

export const GuidedObservationSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  promptInLanguage: z.record(z.string()).optional(),
  expectedOutcome: z.string().optional(),
  inputVariableKey: z.string(),
  dependentVariableKey: z.string(),
});

export const ScientificReasoningQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  promptInLanguage: z.record(z.string()).optional(),
  options: z.array(z.string()),
  optionsInLanguage: z.record(z.array(z.string())).optional(),
  correctOptionIndex: z.number(),
  explanation: z.string(),
  explanationInLanguage: z.record(z.string()).optional(),
});

export const ScientificExplanationModelSchema = z.object({
  title: z.string(),
  summary: z.string(),
  summaryInLanguage: z.record(z.string()).optional(),
  corePrinciples: z.array(
    z.object({
      title: z.string(),
      statement: z.string(),
      detail: z.string(),
    })
  ),
  mathematicalModel: z
    .object({
      formula: z.string(),
      variableDescriptions: z.record(z.string()),
      assumptionsAndLimitations: z.array(z.string()),
    })
    .optional(),
  everydayRelevance: z.string(),
  ruralRelevance: z.string(),
});

export const ApplicationTransferChallengeSchema = z.object({
  scenarioTitle: z.string(),
  scenarioDescription: z.string(),
  scenarioDescriptionInLanguage: z.record(z.string()).optional(),
  problemStatement: z.string(),
  options: z.array(z.string()),
  optionsInLanguage: z.record(z.array(z.string())).optional(),
  correctOptionIndex: z.number(),
  practicalTakeaway: z.string(),
});

export const ExperimentSafetyProfileSchema = z.object({
  minimumGrade: z.number(),
  maximumGrade: z.number().optional(),
  mode: z.enum(['VIRTUAL_ONLY', 'PHYSICAL_COMPANION_SUPERVISED', 'CLASSROOM_DEMO', 'MAKER_PROJECT']),
  reviewStatus: z.enum([
    'VERIFIED_SAFE',
    'PENDING_REVIEW',
    'RESTRICTED',
    'SAFE_HOME_MATERIALS',
    'SUPERVISED_CLASSROOM_ONLY',
    'HAZARDOUS_DO_NOT_REPLICATE',
  ]),
  supervisionRequired: z.boolean(),
  hazardWarnings: z.array(z.string()),
  approvedProcedureNotice: z.string(),
});

export const ExperimentManifestSchema = z.object({
  experimentId: z.string(),
  version: z.string(),
  code: z.string(),
  title: z.string(),
  titleInLanguage: z.record(z.string()).optional(),
  shortDescription: z.string(),
  description: z.string(),
  descriptionInLanguage: z.record(z.string()).optional(),
  subject: z.string(),
  stemPillar: z.enum(['SCIENCE', 'MATHEMATICS', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'COMPUTING']),
  gradeRange: z.object({ min: z.number(), max: z.number() }),
  supportedLanguages: z.array(z.string()),
  curriculumMappings: z.array(ExperimentCurriculumMappingSchema),
  learningObjectives: z.array(z.string()),
  safetyProfile: ExperimentSafetyProfileSchema,
  simulation: z.object({
    type: z.enum([
      'CHEMISTRY_ACID_BASE',
      'PHYSICS_MECHANICS_FRICTION',
      'PHYSICS_ROTATIONAL_DYNAMICS',
      'BIOLOGY_CELL_OBSERVATION',
      'CIRCUIT_BREADBOARD',
      'OPTICS_BENCH',
      'CUSTOM_CANVAS',
    ]),
    rulesetIdentifier: z.string(),
    initialState: z.record(z.any()),
    availableApparatus: z.array(VirtualApparatusSchema),
    approvedMaterials: z.array(ApprovedMaterialSchema),
    permittedActions: z.array(z.string()),
    canvasConfig: z.object({
      aspectRatio: z.string(),
      coordinateSpace: z.object({ width: z.number(), height: z.number() }),
      theme: z.string(),
    }),
  }),
  learningLifecycle: z.object({
    mission: z.object({
      title: z.string(),
      context: z.string(),
      scientificQuestion: z.string(),
      keyTerms: z.array(z.object({ term: z.string(), definition: z.string() })),
    }),
    prediction: PredictionChallengeSchema,
    observations: z.array(GuidedObservationSchema),
    questions: z.array(ScientificReasoningQuestionSchema),
    hints: z.array(ProgressiveHintSchema),
    explanation: ScientificExplanationModelSchema,
    application: ApplicationTransferChallengeSchema,
  }),
  offlineEligibility: z.boolean(),
  contentVerificationStatus: z.enum(['VERIFIED', 'PUBLISHED', 'PENDING_REVIEW']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export class ManifestLoader {
  private baseDir: string;
  private cachedManifests: Map<string, ExperimentManifest> = new Map();

  constructor(customBaseDir?: string) {
    if (customBaseDir) {
      this.baseDir = customBaseDir;
    } else {
      const candidates = [
        path.resolve(process.cwd(), 'content/experiments'),
        path.resolve(process.cwd(), '../../content/experiments'),
        path.resolve(__dirname, '../../../../../content/experiments'),
        path.resolve(__dirname, '../../../../content/experiments'),
      ];
      this.baseDir = candidates.find((d) => fs.existsSync(d)) || candidates[0];
    }
  }

  /**
   * Load and validate all experiment manifests from disk.
   */
  async loadAllManifests(): Promise<ExperimentManifest[]> {
    const manifests: ExperimentManifest[] = [];

    if (!fs.existsSync(this.baseDir)) {
      logger.warn(`Experiment base directory does not exist: ${this.baseDir}`);
      return manifests;
    }

    const findManifestFiles = (dir: string): string[] => {
      let results: string[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          results = results.concat(findManifestFiles(fullPath));
        } else if (entry.isFile() && entry.name === 'manifest.json') {
          results.push(fullPath);
        }
      }
      return results;
    };

    const manifestFiles = findManifestFiles(this.baseDir);
    logger.info(`Discovered ${manifestFiles.length} experiment manifest files`);

    for (const file of manifestFiles) {
      try {
        const raw = fs.readFileSync(file, 'utf-8');
        const parsed = JSON.parse(raw);
        const validated = ExperimentManifestSchema.parse(parsed) as ExperimentManifest;
        this.cachedManifests.set(validated.experimentId, validated);
        manifests.push(validated);
        logger.debug(`Loaded experiment manifest: ${validated.code} (${validated.title})`);
      } catch (err: any) {
        logger.error(`Failed to load/validate manifest at ${file}: ${err.message}`);
      }
    }

    return manifests;
  }

  getManifestById(experimentId: string): ExperimentManifest | null {
    return this.cachedManifests.get(experimentId) || null;
  }

  getManifestByCode(code: string): ExperimentManifest | null {
    for (const manifest of this.cachedManifests.values()) {
      if (manifest.code.toUpperCase() === code.toUpperCase()) {
        return manifest;
      }
    }
    return null;
  }

  /**
   * Sync loaded manifests to the Prisma PostgreSQL database (idempotent upsert).
   */
  async syncToDatabase(): Promise<number> {
    const manifests = Array.from(this.cachedManifests.values());
    let upsertCount = 0;

    for (const manifest of manifests) {
      try {
        const gradeLevels = [];
        for (let g = manifest.gradeRange.min; g <= manifest.gradeRange.max; g++) {
          gradeLevels.push(g);
        }

        const exp = await prisma.experiment.upsert({
          where: { code: manifest.code },
          create: {
            code: manifest.code,
            title: manifest.title,
            summary: manifest.shortDescription,
            subjectCode: manifest.subject.toLowerCase(),
            gradeLevels,
            simulationType: manifest.simulation.type as any,
            executionMode: manifest.safetyProfile.mode as any,
            safetyStatus: manifest.safetyProfile.reviewStatus as any,
            verificationStatus: 'PUBLISHED',
            curriculumMappings: manifest.curriculumMappings as any,
            primaryLanguage: 'en',
            availableLanguages: manifest.supportedLanguages,
          },
          update: {
            title: manifest.title,
            summary: manifest.shortDescription,
            gradeLevels,
            simulationType: manifest.simulation.type as any,
            executionMode: manifest.safetyProfile.mode as any,
            safetyStatus: manifest.safetyProfile.reviewStatus as any,
            curriculumMappings: manifest.curriculumMappings as any,
            availableLanguages: manifest.supportedLanguages,
          },
        });

        await prisma.experimentVersion.upsert({
          where: {
            experimentId_version: {
              experimentId: exp.id,
              version: manifest.version,
            },
          },
          create: {
            experimentId: exp.id,
            version: manifest.version,
            isLatest: true,
            manifestJson: manifest as any,
          },
          update: {
            manifestJson: manifest as any,
            isLatest: true,
          },
        });

        upsertCount++;
      } catch (err: any) {
        logger.error(`Database sync error for experiment ${manifest.code}: ${err.message}`);
      }
    }

    logger.info(`Successfully synced ${upsertCount} experiment manifests to PostgreSQL`);
    return upsertCount;
  }
}

export const manifestLoader = new ManifestLoader();
