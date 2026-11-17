import { IVillageBuilderService, VillageBuilderStatusResponse } from './village-builder.contracts';
import { VILLAGE_BUILDER_MANIFEST } from './village-builder.manifest';
import { featureFlagsService } from '../feature-flags';
import { FeatureModuleManifest, LearnerContext } from '@gaonlab/shared-types';

export class VillageBuilderService implements IVillageBuilderService {
  getManifest(): FeatureModuleManifest {
    return VILLAGE_BUILDER_MANIFEST;
  }

  async getStatus(learnerContext?: Partial<LearnerContext>): Promise<VillageBuilderStatusResponse> {
    const isEnabled = await featureFlagsService.isEnabled(
      VILLAGE_BUILDER_MANIFEST.featureFlagKey,
      learnerContext
        ? {
            environment: 'development',
            learnerCategory: learnerContext.learnerCategory,
            organisationId: learnerContext.institution?.schoolId,
          }
        : undefined
    );

    return {
      featureId: 'VILLAGE_BUILDER',
      moduleName: VILLAGE_BUILDER_MANIFEST.name,
      owner: 'Prashanth',
      description: VILLAGE_BUILDER_MANIFEST.description,
      frontendRoute: '/app/village-builder',
      status: isEnabled ? 'INTEGRATION_PENDING' : 'REGISTERED',
      isFeatureFlagActive: isEnabled,
      supportedLearnerSegments: VILLAGE_BUILDER_MANIFEST.supportedLearnerSegments,
      requiredPermissions: VILLAGE_BUILDER_MANIFEST.requiredPermissions,
      integrationReadiness: VILLAGE_BUILDER_MANIFEST.integrationReadiness,
      supportedIdentifiers: VILLAGE_BUILDER_MANIFEST.supportedIdentifiers,
      geographicReadiness: {
        districtContextSupported: true,
        offlineTileCacheSupported: false,
      },
      note: 'Module foundation registered. Virtual village simulations, map layers, and game mechanics are owned and independently developed by Prashanth.',
    };
  }
}

export const villageBuilderService = new VillageBuilderService();
