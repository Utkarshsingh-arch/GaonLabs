import { FeatureModuleManifest } from '@gaonlab/shared-types';

export const VILLAGE_BUILDER_MANIFEST: FeatureModuleManifest = {
  featureId: 'VILLAGE_BUILDER',
  name: 'STEM Village Builder',
  displayNameInLanguage: {
    en: 'STEM Village Builder',
    hi: 'स्टेम ग्राम निर्माता',
    kn: 'ಸ್ಟೆಮ್ ಗ್ರಾಮ ನಿರ್ಮಾಣ',
  },
  description:
    'Build, develop and transform a village using science, technology and engineering. Solve real-world challenges and improve your virtual community.',
  frontendRoute: '/app/village-builder',
  status: 'INTEGRATION_PENDING',
  owner: 'Prashanth',
  supportedLearnerSegments: ['MIDDLE', 'SECONDARY', 'POST_SCHOOL'],
  requiredPermissions: ['LOCAL_STORAGE_STATE', 'OFFLINE_CACHE_STORAGE'],
  featureFlagKey: 'VILLAGE_BUILDER_ENABLED',
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
