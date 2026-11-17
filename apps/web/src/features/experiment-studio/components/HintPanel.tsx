import React from 'react';
import { ProgressiveHint } from '@gaonlab/shared-types';
import { Lightbulb, Lock, Unlock, ArrowRight } from 'lucide-react';

interface HintPanelProps {
  hints: ProgressiveHint[];
  unlockedTiers: number[];
  language?: string;
  onUnlockHint: (tier: number) => void;
  onNext: () => void;
}

export const HintPanel: React.FC<HintPanelProps> = ({
  hints,
  unlockedTiers,
  language = 'en',
  onUnlockHint,
  onNext,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold text-amber-700 tracking-wider uppercase font-mono">
            Phase 6: Progressive Scientific Guidance
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {language === 'kn' ? 'ಹಂತ ಹಂತದ ಸುಳಿವುಗಳು' : 'Graduated Hints & Clues'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Stuck on a tricky concept? Reveal gentle hints without giving away the complete answer at once.
          </p>
        </div>
      </div>

      {/* Hints Cards */}
      <div className="space-y-4">
        {hints.map((hint) => {
          const isUnlocked = unlockedTiers.includes(hint.tier);

          return (
            <div
              key={hint.tier}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isUnlocked
                  ? 'bg-amber-50/40 border-amber-300'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="p-4 sm:p-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isUnlocked
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                      Hint Tier {hint.tier}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{hint.title}</h4>
                  </div>
                </div>

                {!isUnlocked && (
                  <button
                    type="button"
                    onClick={() => onUnlockHint(hint.tier)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition"
                  >
                    Reveal Hint
                  </button>
                )}
              </div>

              {isUnlocked && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-700 leading-relaxed border-t border-amber-200/60 mt-1">
                  {language === 'kn' && hint.textInLanguage?.kn ? hint.textInLanguage.kn : hint.text}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm shadow-md shadow-brand-600/20 transition"
        >
          <span>Examine Scientific Theory & Math</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
