import { LearnerCategory, PolicyEnvironment } from '@gaonlab/shared-types';

export interface CreateFeatureFlagInput {
  key: string;
  description: string;
  isEnabledGlobally?: boolean;
  enabledEnvironments?: PolicyEnvironment[];
  allowedCategories?: LearnerCategory[];
  allowedOrganisations?: string[];
  metadata?: Record<string, unknown>;
}

export interface EvaluateFlagContext {
  environment: PolicyEnvironment;
  learnerCategory?: LearnerCategory;
  organisationId?: string;
}

export interface IFeatureFlagsService {
  createOrUpdateFlag(input: CreateFeatureFlagInput): Promise<any>;
  isEnabled(key: string, context?: EvaluateFlagContext): Promise<boolean>;
  listFlags(): Promise<any[]>;
}
