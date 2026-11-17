import { IFeatureCatalogueService } from './feature-catalogue.contracts';
import { stemLensService } from '../stem-lens';
import { villageBuilderService } from '../village-builder';
import { experimentCatalogueService } from '../experiment-studio';
import { featureFlagsService } from '../feature-flags';
import { FeatureCatalogueResponse, FeatureModuleManifest, LearnerContext } from '@gaonlab/shared-types';

export class FeatureCatalogueService implements IFeatureCatalogueService {
  private registeredManifests: FeatureModuleManifest[] = [
    stemLensService.getManifest(),
    villageBuilderService.getManifest(),
    experimentCatalogueService.getManifest(),
  ];

  getFeatureById(featureId: string): FeatureModuleManifest | null {
    const found = this.registeredManifests.find(
      (m) => m.featureId.toUpperCase() === featureId.toUpperCase()
    );
    return found || null;
  }

  async getCatalogue(learnerContext?: Partial<LearnerContext>): Promise<FeatureCatalogueResponse> {
    const featuresWithFlags = await Promise.all(
      this.registeredManifests.map(async (manifest) => {
        const isEnabled = await featureFlagsService.isEnabled(
          manifest.featureFlagKey,
          learnerContext
            ? {
                environment: 'development',
                learnerCategory: learnerContext.learnerCategory,
                organisationId: learnerContext.institution?.schoolId,
              }
            : undefined
        );

        return {
          ...manifest,
          status: isEnabled ? manifest.status : ('DISABLED' as const),
        };
      })
    );

    return {
      features: featuresWithFlags,
      totalRegistered: featuresWithFlags.length,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    };
  }
}

export const featureCatalogueService = new FeatureCatalogueService();
