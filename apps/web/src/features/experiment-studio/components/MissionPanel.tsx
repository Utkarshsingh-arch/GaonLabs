import React from 'react';
import { ExperimentManifest } from '@gaonlab/shared-types';
import { Compass, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

interface MissionPanelProps {
  manifest: ExperimentManifest;
  language?: string;
  onNext: () => void;
}

export const MissionPanel: React.FC<MissionPanelProps> = ({
  manifest,
  language = 'en',
  onNext,
}) => {
  const { mission } = manifest.learningLifecycle;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 shrink-0">
          <Compass className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold text-brand-700 tracking-wider uppercase font-mono">
            Phase 1: Scientific Mission & Discovery
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {language === 'kn' && manifest.titleInLanguage?.kn
              ? manifest.titleInLanguage.kn
              : manifest.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {manifest.curriculumMappings.map((cm) => `${cm.boardId} Class ${cm.grade}`).join(' • ')}
          </p>
        </div>
      </div>

      {/* Story Context Callout */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 text-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>The Everyday Mystery</span>
        </h4>
        <p className="text-sm leading-relaxed text-slate-700">{mission.context}</p>
      </div>

      {/* Primary Scientific Question */}
      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-800">
          Inquiry Question
        </span>
        <p className="text-base font-bold text-slate-900 mt-1 leading-snug">
          "{mission.scientificQuestion}"
        </p>
      </div>

      {/* Key Terms Glossary */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-3">
          <BookOpen className="w-4 h-4 text-brand-600" />
          <span>Key Scientific Vocabulary</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mission.keyTerms.map((term, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-xs font-bold text-slate-900 block">{term.term}</span>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{term.definition}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm shadow-md shadow-brand-600/20 transition"
        >
          <span>Formulate Your Prediction</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
