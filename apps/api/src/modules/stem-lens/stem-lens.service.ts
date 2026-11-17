import { IStemLensService, StemLensStatusResponse } from './stem-lens.contracts';
import { STEM_LENS_MANIFEST } from './stem-lens.manifest';
import { featureFlagsService } from '../feature-flags';
import { FeatureModuleManifest, LearnerContext } from '@gaonlab/shared-types';

export class StemLensService implements IStemLensService {
  getManifest(): FeatureModuleManifest {
    return STEM_LENS_MANIFEST;
  }

  async getStatus(learnerContext?: Partial<LearnerContext>): Promise<StemLensStatusResponse> {
    const isEnabled = await featureFlagsService.isEnabled(
      STEM_LENS_MANIFEST.featureFlagKey,
      learnerContext
        ? {
            environment: 'development',
            learnerCategory: learnerContext.learnerCategory,
            organisationId: learnerContext.institution?.schoolId,
          }
        : undefined
    );

    return {
      featureId: 'STEM_LENS',
      moduleName: STEM_LENS_MANIFEST.name,
      owner: 'Robin',
      description: STEM_LENS_MANIFEST.description,
      frontendRoute: '/app/stem-lens',
      status: isEnabled ? 'INTEGRATION_PENDING' : 'REGISTERED',
      isFeatureFlagActive: isEnabled,
      supportedLearnerSegments: STEM_LENS_MANIFEST.supportedLearnerSegments,
      requiredPermissions: STEM_LENS_MANIFEST.requiredPermissions,
      integrationReadiness: STEM_LENS_MANIFEST.integrationReadiness,
      supportedIdentifiers: STEM_LENS_MANIFEST.supportedIdentifiers,
      note: 'Module foundation registered. Core object recognition and lens pipeline are owned and independently developed by Robin.',
    };
  }
}

export const stemLensService = new StemLensService();
