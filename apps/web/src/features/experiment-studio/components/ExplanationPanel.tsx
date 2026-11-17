import React from 'react';
import { ScientificExplanationModel } from '@gaonlab/shared-types';
import { BookOpen, Sparkles, Tractor, ArrowRight } from 'lucide-react';

interface ExplanationPanelProps {
  explanation: ScientificExplanationModel;
  language?: string;
  onNext: () => void;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  explanation,
  language = 'en',
  onNext,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold text-teal-700 tracking-wider uppercase font-mono">
            Phase 7: Scientific Principles & Theory
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {explanation.title}
          </h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {language === 'kn' && explanation.summaryInLanguage?.kn
              ? explanation.summaryInLanguage.kn
              : explanation.summary}
          </p>
        </div>
      </div>

      {/* Core Principles */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Fundamental Laws & Mechanisms
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {explanation.corePrinciples.map((cp, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">{cp.title}</span>
                <span className="text-xs font-mono text-brand-700 font-semibold mt-1 block">
                  {cp.statement}
                </span>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{cp.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mathematical Model */}
      {explanation.mathematicalModel && (
        <div className="bg-slate-900 rounded-2xl p-5 text-white border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono uppercase text-brand-300">
              Mathematical Model
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Standard Formulation</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl font-mono text-sm text-amber-300 font-bold border border-slate-800 text-center">
            {explanation.mathematicalModel.formula}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
            {Object.entries(explanation.mathematicalModel.variableDescriptions).map(
              ([varName, desc]) => (
                <div key={varName} className="flex items-start gap-1.5 font-mono">
                  <span className="text-brand-400 font-bold">{varName}:</span>
                  <span className="text-slate-400">{desc}</span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Everyday & Rural Relevance Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Everyday Life Connection</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{explanation.everydayRelevance}</p>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
            <Tractor className="w-4 h-4 text-emerald-600" />
            <span>Rural Context & Farming Practice</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{explanation.ruralRelevance}</p>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm shadow-md shadow-brand-600/20 transition"
        >
          <span>Apply to Real-World Challenge</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
