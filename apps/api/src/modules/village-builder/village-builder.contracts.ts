import {
  FeatureModuleManifest,
  FeatureModuleStatus,
  LearnerCategory,
  LearnerContext
} from '@gaonlab/shared-types';

export interface VillageBuilderGeographicBinding {
  district?: string;
  state?: string;
  pincode?: string;
  agroClimaticZone?: string; // e.g. "COASTAL_HUMID", "SEMI_ARID_DECCAN"
  villageProfileId?: string;
}

export interface VillageBuilderCurriculumBinding {
  boardId: string;
  curriculumVersionId: string;
  conceptId?: string;
  targetCompetency?: string; // e.g. "IRRIGATION_EFFICIENCY", "SOLAR_ENERGY"
}

export interface VillageBuilderActivityEvent {
  eventId: string;
  learnerId: string;
  villageSessionId: string;
  infrastructureAction: string; // e.g. "CONSTRUCT_RAINWATER_HARVESTER", "UPGRADE_WINDMILL"
  resourcesUtilized: Record<string, number>;
  curriculumBinding?: VillageBuilderCurriculumBinding;
  geographicBinding?: VillageBuilderGeographicBinding;
  timestamp: string;
}

export interface VillageBuilderStatusResponse {
  featureId: 'VILLAGE_BUILDER';
  moduleName: string;
  owner: 'Prashanth';
  description: string;
  frontendRoute: '/app/village-builder';
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
  geographicReadiness: {
    districtContextSupported: boolean;
    offlineTileCacheSupported: boolean;
  };
  note: string;
}

export interface IVillageBuilderService {
  getManifest(): FeatureModuleManifest;
  getStatus(learnerContext?: Partial<LearnerContext>): Promise<VillageBuilderStatusResponse>;
}
