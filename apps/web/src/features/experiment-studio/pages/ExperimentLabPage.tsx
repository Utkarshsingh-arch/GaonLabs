import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { ExperimentManifest, ExperimentSessionDTO } from '@gaonlab/shared-types';
import { fetchExperimentManifest, startExperimentSession } from '../services/experimentApi';
import { useExperimentPlayer } from '../engine/ExperimentPlayerState';
import { LifecycleStepper } from '../components/LifecycleStepper';
import { MissionPanel } from '../components/MissionPanel';
import { PredictionPanel } from '../components/PredictionPanel';
import { ObservationPanel } from '../components/ObservationPanel';
import { QuestionPanel } from '../components/QuestionPanel';
import { HintPanel } from '../components/HintPanel';
import { ExplanationPanel } from '../components/ExplanationPanel';
import { ApplicationPanel } from '../components/ApplicationPanel';
import { CompletionPanel } from '../components/CompletionPanel';
import { ChemistryRenderer } from '../runtimes/chemistry/ChemistryRenderer';
import { PhysicsRenderer } from '../runtimes/physics/PhysicsRenderer';
import { SyncStatusIndicator } from '../components/SyncStatusIndicator';
import { getDemoSession } from '../../../services/demoAuth';
import { ArrowLeft, FlaskConical } from 'lucide-react';

export const ExperimentLabPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const session = getDemoSession();
  const medium = session?.medium || 'en';

  const [manifest, setManifest] = useState<ExperimentManifest | null>(
    (location.state as any)?.manifest || null
  );
  const [initialSession, setInitialSession] = useState<ExperimentSessionDTO | null>(
    (location.state as any)?.session || null
  );
  const [loading, setLoading] = useState<boolean>(!manifest);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      if (!id) return;
      if (manifest && initialSession) return;

      setLoading(true);
      try {
        const m = await fetchExperimentManifest(id);
        setManifest(m);

        const sessResult = await startExperimentSession(m.code, {
          learnerPersonId: session?.email || 'demo-learner',
          boardId: session?.boardId || 'CBSE',
          grade: session?.grade || m.gradeRange.min,
          language: medium,
        });
        setInitialSession(sessResult.session);
      } catch (err: any) {
        setError(err.message || 'Failed to initialize experiment');
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [id, manifest, initialSession, session, medium]);

  if (loading || !manifest) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-mono">Calibrating virtual apparatus...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-sm text-rose-600 font-bold">{error}</p>
        <Link
          to="/app/experiments"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Experiments</span>
        </Link>
      </div>
    );
  }

  return (
    <ExperimentLabInner
      manifest={manifest}
      initialSession={initialSession}
      medium={medium}
      onExit={() => navigate(`/app/experiments/${manifest.code}`)}
    />
  );
};

interface InnerProps {
  manifest: ExperimentManifest;
  initialSession: ExperimentSessionDTO | null;
  medium: string;
  onExit: () => void;
}

const ExperimentLabInner: React.FC<InnerProps> = ({
  manifest,
  initialSession,
  medium,
  onExit,
}) => {
  const player = useExperimentPlayer(manifest, initialSession);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl px-6 py-4 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Leave Lab"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-700 font-mono uppercase">
                {manifest.code}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-slate-700">
                {medium === 'kn' && manifest.titleInLanguage?.kn
                  ? manifest.titleInLanguage.kn
                  : manifest.title}
              </span>
            </div>
          </div>
        </div>

        {/* Sync Status & Lab Bench Quick Jump */}
        <div className="flex items-center gap-3">
          <SyncStatusIndicator />

          <button
            type="button"
            onClick={() => player.goToPhase('EXPERIMENT')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
              player.currentPhase === 'EXPERIMENT'
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>{player.currentPhase === 'EXPERIMENT' ? 'Active on Bench' : 'Jump to Bench'}</span>
          </button>
        </div>
      </div>

      {/* 7-Phase Lifecycle Stepper */}
      <LifecycleStepper
        currentPhase={player.currentPhase}
        onSelectPhase={(phase) => player.goToPhase(phase)}
        language={medium}
      />

      {/* Dynamic Lifecycle Phase View */}
      <div className="transition-all duration-200">
        {player.currentPhase === 'MISSION' && (
          <MissionPanel
            manifest={manifest}
            language={medium}
            onNext={() => player.goToPhase('PREDICTION')}
          />
        )}

        {player.currentPhase === 'PREDICTION' && (
          <PredictionPanel
            prediction={manifest.learningLifecycle.prediction}
            selectedOptionId={player.selectedPredictionId}
            language={medium}
            onSubmitPrediction={(optId) => player.submitPrediction(optId)}
            onNext={() => player.goToPhase('EXPERIMENT')}
          />
        )}

        {player.currentPhase === 'EXPERIMENT' && (
          <div className="space-y-4">
            {manifest.simulation.type === 'CHEMISTRY_ACID_BASE' && (
              <ChemistryRenderer
                materials={manifest.simulation.approvedMaterials}
                apparatus={manifest.simulation.availableApparatus}
                language={medium}
                onRecordObservation={(obs) => player.addObservation(obs)}
              />
            )}

            {manifest.simulation.type === 'PHYSICS_MECHANICS_FRICTION' && (
              <PhysicsRenderer
                materials={manifest.simulation.approvedMaterials}
                apparatus={manifest.simulation.availableApparatus}
                language={medium}
                onRecordObservation={(obs) => player.addObservation(obs)}
              />
            )}

            {/* Next Step Banner below canvas */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {player.recordedObservations.length > 0
                  ? `${player.recordedObservations.length} trials logged. Ready to analyze findings.`
                  : 'Conduct experiments and click Record Observation to log your trials.'}
              </span>
              <button
                type="button"
                onClick={() => player.goToPhase('OBSERVATION')}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                Proceed to Data Analysis
              </button>
            </div>
          </div>
        )}

        {player.currentPhase === 'OBSERVATION' && (
          <ObservationPanel
            observations={manifest.learningLifecycle.observations}
            recordedObservations={player.recordedObservations}
            language={medium}
            onNext={() => player.goToPhase('QUESTIONING')}
          />
        )}

        {player.currentPhase === 'QUESTIONING' && (
          <QuestionPanel
            questions={manifest.learningLifecycle.questions}
            answers={player.questionAnswers}
            language={medium}
            onAnswerQuestion={(qId, idx, isCorrect) =>
              player.answerQuestion(qId, idx, isCorrect)
            }
            onNext={() => player.goToPhase('HINTS')}
          />
        )}

        {player.currentPhase === 'HINTS' && (
          <HintPanel
            hints={manifest.learningLifecycle.hints}
            unlockedTiers={player.unlockedHintTiers}
            language={medium}
            onUnlockHint={(tier) => player.unlockHint(tier)}
            onNext={() => player.goToPhase('EXPLANATION')}
          />
        )}

        {player.currentPhase === 'EXPLANATION' && (
          <ExplanationPanel
            explanation={manifest.learningLifecycle.explanation}
            language={medium}
            onNext={() => player.goToPhase('APPLICATION')}
          />
        )}

        {player.currentPhase === 'APPLICATION' && (
          <ApplicationPanel
            application={manifest.learningLifecycle.application}
            selectedOptionIndex={player.applicationAnswerIndex}
            language={medium}
            onSubmitApplication={(idx) => player.submitApplication(idx)}
            onNext={() => player.goToPhase('COMPLETED')}
          />
        )}

        {player.currentPhase === 'COMPLETED' && (
          <CompletionPanel
            manifest={manifest}
            recordedObservationsCount={player.recordedObservations.length}
            questionsCount={manifest.learningLifecycle.questions.length}
            language={medium}
            onFinish={(note) => player.finishExperiment(note)}
            onRestart={() => player.goToPhase('MISSION')}
          />
        )}
      </div>
    </div>
  );
};
