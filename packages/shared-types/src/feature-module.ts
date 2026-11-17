/**
 * Feature Module & Dashboard Integration Contracts
 * Defines standard interfaces for independently developed GaonLab modules
 * (e.g., STEM Lens by Robin, STEM Village Builder by Prashanth).
 */

import { LearnerCategory, SupportedLanguage } from './learner-context';

export type FeatureModuleStatus =
  | 'REGISTERED'
  | 'NOT_IMPLEMENTED'
  | 'INTEGRATION_PENDING'
  | 'ACTIVE'
  | 'DISABLED';

export interface FeatureModuleManifest {
  featureId: string; // e.g. "STEM_LENS", "VILLAGE_BUILDER"
  name: string;
  displayNameInLanguage?: Record<SupportedLanguage, string>;
  description: string;
  frontendRoute: string; // e.g. "/app/stem-lens", "/app/village-builder"
  status: FeatureModuleStatus;
  owner: string; // e.g. "Robin", "Prashanth"
  supportedLearnerSegments: LearnerCategory[];
  requiredPermissions: string[];
  featureFlagKey: string;
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
}

export interface FeatureCatalogueResponse {
  features: FeatureModuleManifest[];
  totalRegistered: number;
  environment: string;
  timestamp: string;
}
