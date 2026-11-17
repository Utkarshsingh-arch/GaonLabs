import { FeatureCatalogueResponse, FeatureModuleManifest, LearnerContext } from '@gaonlab/shared-types';

export interface IFeatureCatalogueService {
  getCatalogue(learnerContext?: Partial<LearnerContext>): Promise<FeatureCatalogueResponse>;
  getFeatureById(featureId: string): FeatureModuleManifest | null;
}
