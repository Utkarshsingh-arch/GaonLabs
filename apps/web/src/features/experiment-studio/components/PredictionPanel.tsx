import React, { useState } from 'react';
import { PredictionChallenge } from '@gaonlab/shared-types';
import { HelpCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface PredictionPanelProps {
  prediction: PredictionChallenge;
  selectedOptionId: string | null;
  language?: string;
  onSubmitPrediction: (optionId: string) => void;
  onNext: () => void;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({
  prediction,
  selectedOptionId,
  language = 'en',
  onSubmitPrediction,
  onNext,
}) => {
  const [currentSelected, setCurrentSelected] = useState<string | null>(selectedOptionId);

  const handleSelect = (id: string) => {
    setCurrentSelected(id);
    onSubmitPrediction(id);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold text-amber-700 tracking-wider uppercase font-mono">
            Phase 2: Scientific Hypothesizing
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {language === 'kn' && prediction.questionInLanguage?.kn
              ? prediction.questionInLanguage.kn
              : prediction.question}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{prediction.context}</p>
        </div>
      </div>

      {/* Hypothesis Options */}
      <div className="space-y-3">
        {prediction.options.map((opt) => {
          const isChosen = currentSelected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                isChosen
                  ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 shadow-sm'
                  : 'bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shrink-0 transition ${
                  isChosen
                    ? 'bg-amber-500 text-white'
                    : 'border-2 border-slate-300 text-transparent'
                }`}
              >
                <CheckCircle className="w-4 h-4 fill-current text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800 leading-snug">
                  {language === 'kn' && opt.textInLanguage?.kn ? opt.textInLanguage.kn : opt.text}
                </p>
                {isChosen && (
                  <span className="inline-block mt-2 text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                    Hypothesis Locked
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Action */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {currentSelected ? 'Hypothesis recorded. Now test it on the virtual bench.' : 'Select an option to proceed.'}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!currentSelected}
          className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:hover:bg-brand-600 text-white font-bold rounded-xl text-sm shadow-md shadow-brand-600/20 transition"
        >
          <span>Enter Lab Bench</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
