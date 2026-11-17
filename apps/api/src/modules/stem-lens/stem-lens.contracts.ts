import {
  FeatureModuleManifest,
  FeatureModuleStatus,
  LearnerCategory,
  LearnerContext
} from '@gaonlab/shared-types';

export interface StemLensCurriculumBinding {
  boardId: string;
  curriculumVersionId: string;
  textbookEditionId?: string;
  chapterId?: string;
  conceptId?: string;
}

export interface StemLensActivityEvent {
  eventId: string;
  learnerId: string;
  lensSessionId: string;
  targetObjectTag?: string; // e.g. "compost_pit", "well_pulley", "leaf_veins"
  inferredConcepts: string[]; // e.g. ["DECOMPOSITION", "MICROBIOLOGY"]
  curriculumBinding?: StemLensCurriculumBinding;
  timestamp: string;
}

export interface StemLensStatusResponse {
  featureId: 'STEM_LENS';
  moduleName: string;
  owner: 'Robin';
  description: string;
  frontendRoute: '/app/stem-lens';
  status: FeatureModuleStatus;
  isFeatureFlagActive: boolean;
  supportedLearnerSegments: LearnerCategory[];
  requiredPermissions: string[];
  integrationReadiness: {
    contractsDefined: boolean;
    routerMounted: boolean;
    uiPlaceholderReady: boolean;
    businessLogicImplemented: boolean;
  };
  supportedIdentifiers: {
    learnerId: boolean;
    boardId: boolean;
    curriculumVersionId: boolean;
    textbookEditionId: boolean;
    chapterId: boolean;
    conceptId: boolean;
    activityId: boolean;
  };
  note: string;
}

export interface IStemLensService {
  getManifest(): FeatureModuleManifest;
  getStatus(learnerContext?: Partial<LearnerContext>): Promise<StemLensStatusResponse>;
}
