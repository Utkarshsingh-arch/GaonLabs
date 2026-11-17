import { useState, useCallback } from 'react';
import {
  ExperimentLifecyclePhase,
  ExperimentManifest,
  ExperimentSessionDTO,
} from '@gaonlab/shared-types';
import { submitExperimentEvent, completeExperimentSession } from '../services/experimentApi';
import { saveLocalSession } from '../services/experimentOfflineStorage';

export interface ExperimentPlayerState {
  currentPhase: ExperimentLifecyclePhase;
  selectedPredictionId: string | null;
  recordedObservations: any[];
  questionAnswers: Record<string, { selectedIndex: number; isCorrect: boolean }>;
  unlockedHintTiers: number[];
  applicationAnswerIndex: number | null;
  isCompleted: boolean;
  score: number;
  reflectionNote: string;
}

export function useExperimentPlayer(
  manifest: ExperimentManifest,
  initialSession?: ExperimentSessionDTO | null
) {
  const [currentPhase, setCurrentPhase] = useState<ExperimentLifecyclePhase>(
    (initialSession?.currentPhase as ExperimentLifecyclePhase) || 'MISSION'
  );
  const [selectedPredictionId, setSelectedPredictionId] = useState<string | null>(
    initialSession?.predictionData?.optionId ||
      initialSession?.summaryData?.predictionSelected ||
      null
  );
  const [recordedObservations, setRecordedObservations] = useState<any[]>(
    Array.isArray(initialSession?.observationData) ? initialSession!.observationData : []
  );
  const [questionAnswers, setQuestionAnswers] = useState<
    Record<string, { selectedIndex: number; isCorrect: boolean }>
  >(
    initialSession?.responsesData && typeof initialSession.responsesData === 'object'
      ? (initialSession.responsesData as any)
      : {}
  );
  const [unlockedHintTiers, setUnlockedHintTiers] = useState<number[]>([1]);
  const [applicationAnswerIndex, setApplicationAnswerIndex] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(
    initialSession?.isCompleted || false
  );
  const [reflectionNote, setReflectionNote] = useState<string>(
    initialSession?.reflectionNote || ''
  );

  const sessionId = initialSession?.clientSessionId || initialSession?.id || `local_${Date.now()}`;

  // Persist session state to IndexedDB on local state modifications
  const persistSessionSnapshot = useCallback(
    async (overrides: Partial<ExperimentSessionDTO> = {}) => {
      if (!initialSession) return;
      const snapshot: ExperimentSessionDTO = {
        ...initialSession,
        currentPhase: overrides.currentPhase || currentPhase,
        isCompleted: overrides.isCompleted !== undefined ? overrides.isCompleted : isCompleted,
        lastActiveAt: new Date().toISOString(),
        predictionData:
          overrides.predictionData !== undefined
            ? overrides.predictionData
            : selectedPredictionId
            ? { optionId: selectedPredictionId }
            : initialSession.predictionData,
        observationData:
          overrides.observationData !== undefined
            ? overrides.observationData
            : recordedObservations,
        responsesData:
          overrides.responsesData !== undefined
            ? overrides.responsesData
            : questionAnswers,
        reflectionNote:
          overrides.reflectionNote !== undefined
            ? overrides.reflectionNote
            : reflectionNote,
        summaryData: {
          predictionSelected: selectedPredictionId || undefined,
          observationsCount: (overrides.observationData || recordedObservations).length,
          questionsAnsweredCount: Object.keys(overrides.responsesData || questionAnswers).length,
          hintsUsedCount: unlockedHintTiers.length,
          applicationCompleted:
            overrides.isCompleted !== undefined ? overrides.isCompleted : isCompleted,
        },
      };
      await saveLocalSession(snapshot);
    },
    [
      initialSession,
      currentPhase,
      isCompleted,
      selectedPredictionId,
      recordedObservations,
      questionAnswers,
      reflectionNote,
      unlockedHintTiers,
    ]
  );

  const dispatchEvent = useCallback(
    async (
      eventType: any,
      payload: Record<string, any>,
      phase: ExperimentLifecyclePhase = currentPhase
    ) => {
      const clientEventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await submitExperimentEvent(sessionId, {
        clientEventId,
        eventType,
        phase,
        payload,
        timestamp: new Date().toISOString(),
      }, initialSession?.learnerPersonId);
    },
    [sessionId, currentPhase, initialSession?.learnerPersonId]
  );

  const goToPhase = useCallback(
    (newPhase: ExperimentLifecyclePhase) => {
      setCurrentPhase(newPhase);
      dispatchEvent('PHASE_TRANSITION', { targetPhase: newPhase }, newPhase);
      persistSessionSnapshot({ currentPhase: newPhase });
    },
    [dispatchEvent, persistSessionSnapshot]
  );

  const submitPrediction = useCallback(
    (optionId: string) => {
      setSelectedPredictionId(optionId);
      const predictionData = {
        optionId,
        hypothesisSelected:
          manifest.learningLifecycle.prediction.options.find((o) => o.id === optionId)
            ?.isHypothesis || false,
      };
      dispatchEvent('PREDICTION_SUBMITTED', predictionData);
      persistSessionSnapshot({ predictionData });
    },
    [dispatchEvent, manifest, persistSessionSnapshot]
  );

  const addObservation = useCallback(
    (obs: any) => {
      setRecordedObservations((prev) => {
        const next = [...prev, obs];
        persistSessionSnapshot({ observationData: next });
        return next;
      });
      dispatchEvent('OBSERVATION_RECORDED', obs);
    },
    [dispatchEvent, persistSessionSnapshot]
  );

  const answerQuestion = useCallback(
    (questionId: string, selectedIndex: number, isCorrect: boolean) => {
      setQuestionAnswers((prev) => {
        const next = {
          ...prev,
          [questionId]: { selectedIndex, isCorrect },
        };
        persistSessionSnapshot({ responsesData: next });
        return next;
      });
      dispatchEvent('QUESTION_ANSWERED', { questionId, selectedIndex, isCorrect });
    },
    [dispatchEvent, persistSessionSnapshot]
  );

  const unlockHint = useCallback(
    (tier: number) => {
      setUnlockedHintTiers((prev) => (prev.includes(tier) ? prev : [...prev, tier]));
      dispatchEvent('HINT_REQUESTED', { tier });
    },
    [dispatchEvent]
  );

  const submitApplication = useCallback(
    (selectedIndex: number) => {
      setApplicationAnswerIndex(selectedIndex);
      const isCorrect =
        selectedIndex === manifest.learningLifecycle.application.correctOptionIndex;
      dispatchEvent('APPLICATION_SUBMITTED', { selectedIndex, isCorrect });
    },
    [dispatchEvent, manifest]
  );

  const finishExperiment = useCallback(
    async (note?: string) => {
      const finalNote = note || reflectionNote;
      setIsCompleted(true);
      setCurrentPhase('COMPLETED');
      await persistSessionSnapshot({
        isCompleted: true,
        currentPhase: 'COMPLETED',
        reflectionNote: finalNote,
      });
      await completeExperimentSession(sessionId, {
        reflectionNote: finalNote,
        finalScore: 100,
      });
    },
    [sessionId, reflectionNote, persistSessionSnapshot]
  );

  return {
    currentPhase,
    selectedPredictionId,
    recordedObservations,
    questionAnswers,
    unlockedHintTiers,
    applicationAnswerIndex,
    isCompleted,
    reflectionNote,
    setReflectionNote,
    goToPhase,
    submitPrediction,
    addObservation,
    answerQuestion,
    unlockHint,
    submitApplication,
    finishExperiment,
  };
}
