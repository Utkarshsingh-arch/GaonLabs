/**
 * GaonLab Experiment Studio — Shared Types and Domain Contracts
 * Reusable across backend services, frontend simulation runtimes, and local-first offline storage.
 */

import { SupportedBoard, SupportedLanguage } from './learner-context';

export type SimulationType =
  | 'CHEMISTRY_ACID_BASE'
  | 'PHYSICS_MECHANICS_FRICTION'
  | 'PHYSICS_ROTATIONAL_DYNAMICS'
  | 'BIOLOGY_CELL_OBSERVATION';

export type ExperimentExecutionMode = 'VIRTUAL_ONLY' | 'PHYSICAL_COMPANION_SUPERVISED';

export type SafetyReviewStatus = 'VERIFIED_SAFE' | 'PENDING_REVIEW' | 'RESTRICTED';

export type ExperimentLifecyclePhase =
  | 'DISCOVERY'
  | 'MISSION'
  | 'INTRODUCTION'
  | 'PREDICTION'
  | 'EXPERIMENT'
  | 'OBSERVATION'
  | 'QUESTIONING'
  | 'HINTS'
  | 'EXPLANATION'
  | 'APPLICATION'
  | 'COMPLETED';

export type ExperimentEventType =
  | 'SESSION_STARTED'
  | 'PREDICTION_SUBMITTED'
  | 'SIMULATION_STARTED'
  | 'SIMULATION_PAUSED'
  | 'SIMULATION_RESET'
  | 'VARIABLE_CHANGED'
  | 'APPARATUS_INTERACTED'
  | 'OBSERVATION_RECORDED'
  | 'QUESTION_ANSWERED'
  | 'HINT_REQUESTED'
  | 'EXPLANATION_VIEWED'
  | 'APPLICATION_SUBMITTED'
  | 'EXPERIMENT_COMPLETED';

// -----------------------------------------------------------------------------
// Manifest Structures (Data-driven, Declarative JSON)
// -----------------------------------------------------------------------------

export interface ExperimentCurriculumMapping {
  boardId: SupportedBoard | 'ALL';
  grade: number;
  subjectId: string;
  subjectName: string;
  frameworkId?: string;
  textbookEditionId?: string;
  chapterId?: string;
  chapterNumber?: number;
  chapterTitle?: string;
  conceptId?: string;
}

export interface VirtualApparatus {
  id: string;
  name: string;
  nameInLanguage?: Record<string, string>;
  type: string;
  category: 'CONTAINER' | 'MEASURING' | 'DISPENSER' | 'TEST_SURFACE' | 'FORCE_APPLIER' | 'SENSOR';
  capacity?: number;
  unit?: string;
  icon?: string;
}

export interface ApprovedMaterial {
  id: string;
  name: string;
  nameInLanguage?: Record<string, string>;
  type: 'SOLUTION' | 'INDICATOR' | 'SOLID_OBJECT' | 'SURFACE';
  properties: Record<string, any>;
  colorHex?: string;
  safetyNote?: string;
}

export interface ProgressiveHint {
  tier: number; // 1 (subtle), 2 (guiding), 3 (direct)
  title: string;
  text: string;
  textInLanguage?: Record<string, string>;
}

export interface PredictionChallenge {
  id: string;
  question: string;
  questionInLanguage?: Record<string, string>;
  context: string;
  options: Array<{
    id: string;
    text: string;
    textInLanguage?: Record<string, string>;
    isHypothesis: boolean;
  }>;
}

export interface GuidedObservation {
  id: string;
  prompt: string;
  promptInLanguage?: Record<string, string>;
  expectedOutcome?: string;
  inputVariableKey: string;
  dependentVariableKey: string;
}

export interface ScientificReasoningQuestion {
  id: string;
  prompt: string;
  promptInLanguage?: Record<string, string>;
  options: string[];
  optionsInLanguage?: Record<string, string[]>;
  correctOptionIndex: number;
  explanation: string;
  explanationInLanguage?: Record<string, string>;
}

export interface ScientificExplanationModel {
  title: string;
  summary: string;
  summaryInLanguage?: Record<string, string>;
  corePrinciples: Array<{
    title: string;
    statement: string;
    detail: string;
  }>;
  mathematicalModel?: {
    formula: string;
    variableDescriptions: Record<string, string>;
    assumptionsAndLimitations: string[];
  };
  everydayRelevance: string;
  ruralRelevance: string;
}

export interface ApplicationTransferChallenge {
  scenarioTitle: string;
  scenarioDescription: string;
  scenarioDescriptionInLanguage?: Record<string, string>;
  problemStatement: string;
  options: string[];
  optionsInLanguage?: Record<string, string[]>;
  correctOptionIndex: number;
  practicalTakeaway: string;
}

export interface ExperimentSafetyProfile {
  minimumGrade: number;
  maximumGrade?: number;
  mode: ExperimentExecutionMode;
  reviewStatus: SafetyReviewStatus;
  supervisionRequired: boolean;
  hazardWarnings: string[];
  approvedProcedureNotice: string;
}

export interface ExperimentManifest {
  experimentId: string;
  version: string;
  code: string;
  title: string;
  titleInLanguage?: Record<string, string>;
  shortDescription: string;
  description: string;
  descriptionInLanguage?: Record<string, string>;
  subject: string;
  stemPillar: 'SCIENCE' | 'MATHEMATICS' | 'PHYSICS' | 'CHEMISTRY' | 'BIOLOGY' | 'COMPUTING';
  gradeRange: { min: number; max: number };
  supportedLanguages: SupportedLanguage[];
  curriculumMappings: ExperimentCurriculumMapping[];
  learningObjectives: string[];
  safetyProfile: ExperimentSafetyProfile;
  simulation: {
    type: SimulationType;
    rulesetIdentifier: string;
    initialState: Record<string, any>;
    availableApparatus: VirtualApparatus[];
    approvedMaterials: ApprovedMaterial[];
    permittedActions: string[];
    canvasConfig: {
      aspectRatio: string;
      coordinateSpace: { width: number; height: number };
      theme: 'LAB_CLEAN_LIGHT' | 'PHYSICS_CANVAS_LIGHT';
    };
  };
  learningLifecycle: {
    mission: {
      title: string;
      context: string;
      scientificQuestion: string;
      keyTerms: Array<{ term: string; definition: string }>;
    };
    prediction: PredictionChallenge;
    observations: GuidedObservation[];
    questions: ScientificReasoningQuestion[];
    hints: ProgressiveHint[];
    explanation: ScientificExplanationModel;
    application: ApplicationTransferChallenge;
  };
  offlineEligibility: boolean;
  contentVerificationStatus: 'VERIFIED' | 'PUBLISHED' | 'PENDING_REVIEW';
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Catalog & Session DTOs
// -----------------------------------------------------------------------------

export interface ExperimentSummary {
  id: string;
  code: string;
  title: string;
  titleInLanguage?: Record<string, string>;
  shortDescription: string;
  subject: string;
  stemPillar: string;
  minGrade: number;
  maxGrade: number;
  simulationType: SimulationType;
  executionMode: ExperimentExecutionMode;
  safetyStatus: SafetyReviewStatus;
  isOfflineEligible: boolean;
  thumbnailUrl: string;
  supportedLanguages: SupportedLanguage[];
  curriculumMappings: ExperimentCurriculumMapping[];
}

export interface ExperimentSessionDTO {
  id: string;
  clientSessionId?: string;
  experimentId: string;
  experimentVersionId: string;
  learnerPersonId: string;
  boardId: string;
  grade: number;
  language: string;
  currentPhase: ExperimentLifecyclePhase;
  isCompleted: boolean;
  startedAt: string;
  completedAt?: string;
  lastActiveAt: string;
  summaryData?: {
    predictionSelected?: string;
    observationsCount?: number;
    questionsAnsweredCount?: number;
    scorePercent?: number;
    hintsUsedCount?: number;
    applicationCompleted?: boolean;
  };
  predictionData?: any;
  observationData?: any[];
  responsesData?: Record<string, any>;
  reflectionNote?: string;
}

export interface ReconcileExperimentSessionDTO {
  clientSessionId: string;
  experimentId: string;
  experimentVersionId?: string;
  learnerPersonId?: string;
  boardId?: string;
  grade?: number;
  language?: string;
  currentPhase?: ExperimentLifecyclePhase;
  predictionData?: any;
  observationData?: any[];
  responsesData?: Record<string, any>;
  hintsUsedCount?: number;
  reflectionNote?: string;
  isCompleted?: boolean;
  startedAt?: string;
  completedAt?: string;
}

export type ExperimentSyncState =
  | 'SYNCED'
  | 'SAVED_LOCAL'
  | 'WAITING_TO_SYNC'
  | 'SYNCHRONIZING'
  | 'NEEDS_ATTENTION';

export interface IngestExperimentEventDTO {
  clientEventId: string; // UUID for idempotency
  eventType: ExperimentEventType;
  phase: ExperimentLifecyclePhase;
  payload: Record<string, any>;
  timestamp?: string;
}

export interface ExperimentSessionResult {
  session: ExperimentSessionDTO;
  manifest: ExperimentManifest;
  recordedObservations: Array<Record<string, any>>;
  isCompleted: boolean;
}
