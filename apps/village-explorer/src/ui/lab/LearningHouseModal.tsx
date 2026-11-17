import React, { useState } from 'react';
import { BuildingPlacement } from '../../game/data/villageEntities';
import { ZoneId } from '../../learning/types';

interface LearningHouseModalProps {
  building: BuildingPlacement;
  onClose: () => void;
  onOpenRelatedLab?: (zoneId: ZoneId) => void;
}

export const LearningHouseModal: React.FC<LearningHouseModalProps> = ({
  building,
  onClose,
  onOpenRelatedLab,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const mod = building.learningModule;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={building.name}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-sky-500/40 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-slate-800 border border-slate-700">
              {building.icon}
            </span>
            <div>
              <h2 className="text-base font-bold text-amber-400">{building.name}</h2>
              <p className="text-xs text-sky-300 font-medium">{building.subject}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close learning house"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Honest implementation status badge */}
          {mod && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/35 text-sky-300 text-[11px] font-semibold">
              <span>🚧</span>
              <span>{mod.statusLabel}</span>
            </div>
          )}

          <p className="text-sm text-slate-200 leading-relaxed">{building.description}</p>

          {mod && (
            <>
              {/* Planned Experiment Topics */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Planned STEM Experiments
                </h3>
                <ul className="space-y-1.5">
                  {mod.topics.map((topic, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fun Science Fact */}
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5">
                <p className="text-xs text-emerald-200 leading-relaxed">
                  <span className="font-bold text-emerald-300">💡 Village Science Note: </span>
                  {mod.funFact}
                </p>
              </div>

              {/* Quick Interactive Warm-Up Challenge */}
              <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3.5 space-y-2.5">
                <p className="text-xs font-semibold text-amber-200 leading-relaxed">
                  🧠 {mod.miniActivityPrompt}
                </p>
                {!showAnswer ? (
                  <button
                    type="button"
                    onClick={() => setShowAnswer(true)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Reveal Explanation
                  </button>
                ) : (
                  <p className="text-xs text-slate-100 bg-slate-900/70 rounded-lg p-2.5 border border-amber-500/20">
                    <span className="font-bold text-emerald-400">Answer: </span>
                    {mod.miniActivityAnswer}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-900/70 flex flex-wrap items-center justify-between gap-2">
          {mod?.relatedCoreLabId && onOpenRelatedLab ? (
            <button
              type="button"
              onClick={() => onOpenRelatedLab(mod.relatedCoreLabId!)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              🔬 Try Related Active Lab
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            Back to Village
          </button>
        </div>
      </div>
    </div>
  );
};
