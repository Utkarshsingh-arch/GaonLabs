import {
  ExperimentManifest,
  ExperimentSummary,
  FeatureModuleManifest,
  LearnerContext,
  SupportedBoard,
  SupportedLanguage,
} from '@gaonlab/shared-types';
import { manifestLoader } from './manifest-loader';
import { logger } from '../../shared/utils/logger';

export interface ExperimentCatalogueFilters {
  boardId?: string;
  grade?: number;
  subjectId?: string;
  simulationType?: string;
  language?: string;
}

export class ExperimentCatalogueService {
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (!this.isInitialized) {
      await manifestLoader.loadAllManifests();
      await manifestLoader.syncToDatabase();
      this.isInitialized = true;
      logger.info('ExperimentCatalogueService initialized with manifests.');
    }
  }

  /**
   * Manifest definition for GaonLab FeatureCatalogue registration
   */
  getManifest(): FeatureModuleManifest {
    return {
      featureId: 'EXPERIMENT_STUDIO',
      name: 'Experiment Studio',
      displayNameInLanguage: {
        en: 'Experiment Studio',
        kn: 'ಪ್ರಯೋಗ ಶಾಲೆ',
        hi: 'प्रयोगशाला',
      },
      description:
        'Experiential STEM laboratory running interactive, mathematically validated simulations across Physics and Chemistry with a 7-phase inquiry lifecycle.',
      frontendRoute: '/app/experiments',
      status: 'ACTIVE',
      owner: 'GaonLab STEM Core',
      supportedLearnerSegments: ['MIDDLE', 'SECONDARY'],
      requiredPermissions: [],
      featureFlagKey: 'EXPERIMENT_STUDIO_ENABLED',
      integrationReadiness: {
        contractsDefined: true,
        routerMounted: true,
        uiPlaceholderReady: true,
        businessLogicImplemented: true,
      },
      supportedIdentifiers: {
        learnerId: true,
        boardId: true,
        curriculumVersionId: true,
        textbookEditionId: true,
        chapterId: true,
        conceptId: true,
        activityId: true,
      },
    };
  }

  /**
   * List experiment summaries matching optional query filters
   */
  async listExperiments(
    filters: ExperimentCatalogueFilters = {}
  ): Promise<ExperimentSummary[]> {
    await this.initialize();
    const allManifests = await manifestLoader.loadAllManifests();

    let filtered = allManifests;

    if (filters.grade !== undefined && !isNaN(filters.grade)) {
      const g = Number(filters.grade);
      filtered = filtered.filter(
        (m) => g >= m.gradeRange.min && g <= m.gradeRange.max
      );
    }

    if (filters.boardId) {
      const targetBoard = filters.boardId.toUpperCase();
      filtered = filtered.filter((m) =>
        m.curriculumMappings.some(
          (cm) => cm.boardId.toUpperCase() === targetBoard || cm.boardId === 'ALL'
        )
      );
    }

    if (filters.subjectId) {
      const s = filters.subjectId.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.subject.toLowerCase() === s ||
          m.stemPillar.toLowerCase() === s ||
          m.curriculumMappings.some((cm) => cm.subjectId.toLowerCase() === s)
      );
    }

    if (filters.simulationType) {
      filtered = filtered.filter(
        (m) => m.simulation.type === filters.simulationType
      );
    }

    if (filters.language) {
      const lang = filters.language.toLowerCase() as SupportedLanguage;
      filtered = filtered.filter((m) =>
        m.supportedLanguages.map((l) => l.toLowerCase()).includes(lang)
      );
    }

    return filtered.map((m) => this.toSummary(m));
  }

  /**
   * Retrieve full manifest for an experiment by ID or Code
   */
  async getExperimentManifest(idOrCode: string): Promise<ExperimentManifest | null> {
    await this.initialize();
    let manifest = manifestLoader.getManifestById(idOrCode);
    if (!manifest) {
      manifest = manifestLoader.getManifestByCode(idOrCode);
    }
    return manifest;
  }

  /**
   * Retrieve experiment summary by ID or Code
   */
  async getExperimentSummary(idOrCode: string): Promise<ExperimentSummary | null> {
    const manifest = await this.getExperimentManifest(idOrCode);
    return manifest ? this.toSummary(manifest) : null;
  }

  private toSummary(m: ExperimentManifest): ExperimentSummary {
    return {
      id: m.experimentId,
      code: m.code,
      title: m.title,
      titleInLanguage: m.titleInLanguage,
      shortDescription: m.shortDescription,
      subject: m.subject,
      stemPillar: m.stemPillar,
      minGrade: m.gradeRange.min,
      maxGrade: m.gradeRange.max,
      simulationType: m.simulation.type,
      executionMode: m.safetyProfile.mode,
      safetyStatus: m.safetyProfile.reviewStatus,
      isOfflineEligible: m.offlineEligibility,
      thumbnailUrl: `/assets/experiments/thumbnails/${m.code.toLowerCase()}.png`,
      supportedLanguages: m.supportedLanguages,
      curriculumMappings: m.curriculumMappings,
    };
  }
}

export const experimentCatalogueService = new ExperimentCatalogueService();
