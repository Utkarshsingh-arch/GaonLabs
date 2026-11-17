import { FeatureModuleManifest } from '@gaonlab/shared-types';

export const STEM_LENS_MANIFEST: FeatureModuleManifest = {
  featureId: 'STEM_LENS',
  name: 'STEM Lens',
  displayNameInLanguage: {
    en: 'STEM Lens',
    hi: 'स्टेम लेंस',
    kn: 'ಸ್ಟೆಮ್ ಲೆನ್ಸ್',
  },
  description:
    'Discover the science behind everyday objects. Explore the mathematics, physics, biology and engineering hidden in the world around you.',
  frontendRoute: '/app/stem-lens',
  status: 'INTEGRATION_PENDING',
  owner: 'Robin',
  supportedLearnerSegments: ['MIDDLE', 'SECONDARY', 'POST_SCHOOL'],
  requiredPermissions: ['CAMERA_CAPTURE_OPTIONAL', 'OFFLINE_CACHE_STORAGE'],
  featureFlagKey: 'STEM_LENS_ENABLED',
  integrationReadiness: {
    contractsDefined: true,
    routerMounted: true,
    uiPlaceholderReady: true,
    businessLogicImplemented: false,
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
