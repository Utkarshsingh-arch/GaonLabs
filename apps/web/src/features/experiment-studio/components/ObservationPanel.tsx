import React from 'react';
import { GuidedObservation } from '@gaonlab/shared-types';
import { ClipboardList, CheckCircle2, ArrowRight } from 'lucide-react';

interface ObservationPanelProps {
  observations: GuidedObservation[];
  recordedObservations: any[];
  language?: string;
  onNext: () => void;
}

export const ObservationPanel: React.FC<ObservationPanelProps> = ({
  observations,
  recordedObservations,
  language = 'en',
  onNext,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
          <ClipboardList className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold text-blue-700 tracking-wider uppercase font-mono">
            Phase 4: Observation & Data Recording
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {language === 'kn' ? 'ವೀಕ್ಷಣಾ ಫಲಿತಾಂಶಗಳು' : 'Empirical Findings & Data Log'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Compare your recorded trial data against the guided laboratory expectations.
          </p>
        </div>
      </div>

      {/* Guided Tasks Checklist */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Target Guided Protocols
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {observations.map((obs) => (
            <div key={obs.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800">
                  {language === 'kn' && obs.promptInLanguage?.kn ? obs.promptInLanguage.kn : obs.prompt}
                </span>
                {obs.expectedOutcome && (
                  <p className="text-xs text-brand-700 font-medium mt-2 bg-brand-50 p-2 rounded-lg border border-brand-100">
                    Expected: {obs.expectedOutcome}
                  </p>
                )}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                <span>Variable: {obs.inputVariableKey}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recorded Trial Entries */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Recorded Session Trials ({recordedObservations.length})
          </h4>
        </div>

        {recordedObservations.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 text-center text-xs text-slate-500">
            No live bench observations recorded yet. Go to the Lab Bench tab, conduct an experiment, and click "Record Observation".
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            {recordedObservations.map((rec, i) => (
              <div key={i} className="p-4 flex items-start gap-3 hover:bg-slate-50/50 transition">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div className="flex-1 text-xs">
                  <span className="font-semibold text-slate-800 block">
                    Trial #{i + 1}: {rec.outcomeSummary || 'Observation recorded'}
                  </span>
                  <div className="flex flex-wrap gap-3 mt-1 text-[11px] font-mono text-slate-500">
                    {rec.ph !== undefined && <span>pH: {rec.ph}</span>}
                    {rec.stoppingDistanceM !== undefined && (
                      <span>Distance: {rec.stoppingDistanceM}m</span>
                    )}
                    {rec.mu_k !== undefined && <span>μk: {rec.mu_k}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm shadow-md shadow-brand-600/20 transition"
        >
          <span>Investigate Underlying Science</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
