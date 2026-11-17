import {
  FeatureModuleManifest,
  FeatureModuleStatus,
  LearnerCategory,
  LearnerContext
} from '@gaonlab/shared-types';

export interface StemLensCurriculumBinding {
  boardId: string;
  curriculumVersionId: string;
  textbookEditionId?: string;
  chapterId?: string;
  conceptId?: string;
}

export interface StemLensActivityEvent {
  eventId: string;
  learnerId: string;
  lensSessionId: string;
  targetObjectTag?: string; // e.g. "compost_pit", "well_pulley", "leaf_veins"
  inferredConcepts: string[]; // e.g. ["DECOMPOSITION", "MICROBIOLOGY"]
  curriculumBinding?: StemLensCurriculumBinding;
  timestamp: string;
}

export interface StemLensStatusResponse {
  featureId: 'STEM_LENS';
  moduleName: string;
  owner: 'Robin';
  description: string;
  frontendRoute: '/app/stem-lens';
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
  note: string;
}

export interface StemLensChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  imageUrl?: string | null;
  generatedImageUrl?: string | null;
}

export interface StemLensMessageRecord {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  imageUrl?: string | null;
  generatedImageUrl?: string | null;
  model?: string | null;
  tokensUsed?: number | null;
  createdAt: string;
}

export interface StemLensSessionRecord {
  id: string;
  userId: string | null;
  title: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  messages: StemLensMessageRecord[];
}

export interface StemLensChatRequest {
  sessionId?: string;
  userId?: string;
  message: string;
  imageBase64?: string;
  imageMimeType?: string;
  mode?: 'chat' | 'image';
  conversationHistory?: StemLensChatMessage[];
}

export interface StemLensChatResponse {
  sessionId: string;
  userMessageId: string;
  assistantMessageId: string;
  reply: string;
  generatedImageUrl?: string;
  model: string;
  timestamp: string;
  tokensUsed?: number;
  sessionTitle?: string;
}

export interface StemLensGenerateImageRequest {
  prompt: string;
}

export interface StemLensGenerateImageResponse {
  imageUrl: string;
  prompt: string;
  model: string;
  timestamp: string;
}

export interface IStemLensService {
  getManifest(): FeatureModuleManifest;
  getStatus(learnerContext?: Partial<LearnerContext>): Promise<StemLensStatusResponse>;
  chat(request: StemLensChatRequest): Promise<StemLensChatResponse>;
  generateImage(prompt: string): Promise<StemLensGenerateImageResponse>;
  getPromptTemplate(): { systemPrompt: string; filePath: string };
  getSessions(userId?: string): Promise<StemLensSessionRecord[]>;
  getSessionById(sessionId: string): Promise<StemLensSessionRecord | null>;
  createSession(title?: string, userId?: string): Promise<StemLensSessionRecord>;
  updateSessionTitle(sessionId: string, title: string): Promise<StemLensSessionRecord>;
  deleteSession(sessionId: string): Promise<{ success: boolean; id: string }>;
}
