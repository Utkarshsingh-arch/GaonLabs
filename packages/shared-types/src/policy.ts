/**
 * Policy & Feature Flag Domain Contracts
 */

import { LearnerCategory } from './learner-context';

export type PolicyEnvironment = 'development' | 'staging' | 'production';

export interface SegmentPolicy {
  learnerCategory: LearnerCategory;
  canAccessPublicForums: boolean;
  canInitiatePeerChat: boolean;
  requiresGuardianConsentForAI: boolean;
  maxDailyScreenTimeMinutes?: number;
  lowBandwidthForced: boolean;
}

export interface FeatureFlag {
  id: string;
  key: string; // e.g. "ONLINE_AI_ASSISTANT", "PHYSICS_PLAYGROUND", "STEM_LENS"
  description: string;
  isEnabledGlobally: boolean;
  enabledEnvironments: PolicyEnvironment[];
  allowedCategories: LearnerCategory[];
  allowedOrganisations: string[]; // Org UUIDs for targeted pilots
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
