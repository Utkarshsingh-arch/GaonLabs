import React, { useState } from 'react';
import { ApplicationTransferChallenge } from '@gaonlab/shared-types';
import { Tractor, Check, X, ArrowRight } from 'lucide-react';

interface ApplicationPanelProps {
  application: ApplicationTransferChallenge;
  selectedOptionIndex: number | null;
  language?: string;
  onSubmitApplication: (index: number) => void;
  onNext: () => void;
}

export const ApplicationPanel: React.FC<ApplicationPanelProps> = ({
  application,
  selectedOptionIndex,
  language = 'en',
  onSubmitApplication,
  onNext,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(selectedOptionIndex);

  const handleSelect = (idx: number) => {
    setSelectedIndex(idx);
    onSubmitApplication(idx);
  };

  const hasAnswered = selectedIndex !== null;
  const isCorrect = selectedIndex === application.correctOptionIndex;

  const scenarioDesc =
    language === 'kn' && application.scenarioDescriptionInLanguage?.kn
      ? application.scenarioDescriptionInLanguage.kn
      : application.scenarioDescription;

  const options =
    language === 'kn' && application.optionsInLanguage?.kn
      ? application.optionsInLanguage.kn
      : application.options;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
          <Tractor className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase font-mono">
            Phase 8: Practical Application & Community Problem Solving
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {application.scenarioTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Transfer what you tested in the laboratory into solving an everyday community problem.
          </p>
        </div>
      </div>

      {/* Scenario Brief */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 text-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block mb-1">
          Village Problem Statement
        </span>
        <p className="text-sm leading-relaxed text-slate-700">{scenarioDesc}</p>
        <p className="text-sm font-bold text-emerald-950 mt-3 pt-3 border-t border-emerald-200/60">
          {application.problemStatement}
        </p>
      </div>

      {/* Solution Options */}
      <div className="space-y-3">
        {options.map((optText, optIdx) => {
          const isChosen = selectedIndex === optIdx;
          const isCorrectChoice = optIdx === application.correctOptionIndex;

          let btnClass = 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60';
          if (hasAnswered) {
            if (isCorrectChoice) {
              btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold';
            } else if (isChosen && !isCorrect) {
              btnClass = 'bg-rose-50 border-rose-400 text-rose-950';
            }
          }

          return (
            <button
              key={optIdx}
              type="button"
              disabled={hasAnswered}
              onClick={() => handleSelect(optIdx)}
              className={`w-full text-left p-4 rounded-xl border text-xs transition flex items-center justify-between ${btnClass}`}
            >
              <span>{optText}</span>
              {hasAnswered && (
                <span>
                  {isCorrectChoice ? (
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  ) : isChosen ? (
                    <X className="w-4 h-4 text-rose-500 stroke-[3]" />
                  ) : null}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Practical Takeaway Revelation */}
      {hasAnswered && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider">
            Scientific Solution Analysis
          </span>
          <p className="text-xs text-slate-200 leading-relaxed">
            {application.practicalTakeaway}
          </p>
        </div>
      )}

      {/* Bottom Action */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {hasAnswered ? 'Challenge completed.' : 'Select the best practical solution.'}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasAnswered}
          className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:hover:bg-brand-600 text-white font-bold rounded-xl text-sm shadow-md shadow-brand-600/20 transition"
        >
          <span>Finalize Lab Report & Badges</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
