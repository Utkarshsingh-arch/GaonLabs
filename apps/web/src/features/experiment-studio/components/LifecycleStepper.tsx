import React from 'react';
import { ExperimentLifecyclePhase } from '@gaonlab/shared-types';
import { Check, Compass, HelpCircle, FlaskConical, ClipboardList, Lightbulb, BookOpen, Tractor, Award } from 'lucide-react';

interface LifecycleStepperProps {
  currentPhase: ExperimentLifecyclePhase;
  onSelectPhase: (phase: ExperimentLifecyclePhase) => void;
  language?: string;
}

const PHASES: Array<{
  id: ExperimentLifecyclePhase;
  name: string;
  nameKn: string;
  icon: any;
}> = [
  { id: 'MISSION', name: 'Mission', nameKn: 'ಉದ್ದೇಶ', icon: Compass },
  { id: 'PREDICTION', name: 'Predict', nameKn: 'ಊಹಿಸಿ', icon: HelpCircle },
  { id: 'EXPERIMENT', name: 'Lab Bench', nameKn: 'ಪ್ರಯೋಗ', icon: FlaskConical },
  { id: 'OBSERVATION', name: 'Observe', nameKn: 'ವೀಕ್ಷಣೆ', icon: ClipboardList },
  { id: 'QUESTIONING', name: 'Investigate', nameKn: 'ಪ್ರಶ್ನೆಗಳು', icon: HelpCircle },
  { id: 'HINTS', name: 'Hints', nameKn: 'ಸುಳಿವು', icon: Lightbulb },
  { id: 'EXPLANATION', name: 'Understand', nameKn: 'ಸಿದ್ಧಾಂತ', icon: BookOpen },
  { id: 'APPLICATION', name: 'Apply', nameKn: 'ಅನ್ವಯಿಸಿ', icon: Tractor },
  { id: 'COMPLETED', name: 'Complete', nameKn: 'ಪೂರ್ಣ', icon: Award },
];

export const LifecycleStepper: React.FC<LifecycleStepperProps> = ({
  currentPhase,
  onSelectPhase,
  language = 'en',
}) => {
  const currentIndex = PHASES.findIndex((p) => p.id === currentPhase);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-2.5 shadow-sm overflow-x-auto no-scrollbar">
      <div className="flex items-center min-w-[700px] justify-between">
        {PHASES.map((p, idx) => {
          const isCurrent = p.id === currentPhase;
          const isPassed = idx < currentIndex;
          const Icon = p.icon;

          return (
            <React.Fragment key={p.id}>
              <button
                type="button"
                onClick={() => onSelectPhase(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition group ${
                  isCurrent
                    ? 'bg-brand-600 text-white shadow-sm'
                    : isPassed
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isCurrent
                      ? 'bg-white/20 text-white'
                      : isPassed
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isPassed ? <Check className="w-3 h-3 stroke-[3]" /> : <Icon className="w-3 h-3" />}
                </div>
                <span>{language === 'kn' ? p.nameKn : p.name}</span>
              </button>

              {idx < PHASES.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 transition-colors ${
                    idx < currentIndex ? 'bg-emerald-400' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
