import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Sparkles,
  Lightbulb,
  Compass,
  BookOpen,
  Video,
  ArrowRight,
} from 'lucide-react';
import { ContextualExplanation, TopicMatchResult } from '../types';
import { VisualExplainerCanvas } from './VisualExplainerCanvas';
import { matchTopicExplanation } from '../services/api';

interface Props {
  explanation: ContextualExplanation;
  selectedText?: string;
  onClose: () => void;
}

export const ContextualExplanationModal: React.FC<Props> = ({
  explanation,
  selectedText,
  onClose,
}) => {
  const [matchedTopic, setMatchedTopic] = useState<TopicMatchResult | null>(null);

  useEffect(() => {
    let isMounted = true;
    const queryText = selectedText || explanation.title || explanation.topic;

    matchTopicExplanation({
      selectedText: queryText,
      grade: explanation.grade,
      medium: explanation.medium,
    }).then((res) => {
      if (isMounted && res.data) {
        setMatchedTopic(res.data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedText, explanation]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-brand-700 to-brand-900 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/30 flex items-center justify-center border border-brand-400/30">
              <Sparkles className="w-4 h-4 text-brand-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-brand-500/40 rounded-full text-brand-100">
                  Contextual STEM Explainer
                </span>
                <span className="text-xs text-brand-200 font-medium">Class {explanation.grade}</span>
              </div>
              <h3 className="text-base font-bold text-white leading-snug mt-0.5">
                {explanation.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-200 hover:text-white hover:bg-brand-800/60 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-sm">
          {/* Matched Explore STEM Feature Box */}
          {matchedTopic && (
            <div className="bg-gradient-to-r from-brand-50 via-indigo-50 to-purple-50 border border-brand-200 rounded-xl p-3.5 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 text-brand-900 font-bold text-xs">
                  <Compass className="w-3.5 h-3.5 text-brand-600" />
                  <span>Explore STEM Connected Topic</span>
                </div>
                {matchedTopic.hasVideo && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 flex items-center gap-1">
                    <Video className="w-3 h-3 text-red-600" />
                    <span>Video Ready</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 font-medium mb-3">
                {matchedTopic.topicTitle} — {matchedTopic.matchedConcept}
              </p>
              <div className="flex items-center gap-2">
                {matchedTopic.hasVideo && (
                  <Link
                    to={`/app/explore/topics/${matchedTopic.topicId}?tab=watch`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Watch Concept Video</span>
                  </Link>
                )}
                <Link
                  to={`/app/explore/topics/${matchedTopic.topicId}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-brand-500 text-slate-800 text-xs font-bold transition shadow-sm"
                >
                  <span>Open Topic Hub</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Selected Passage Preview */}
          {selectedText && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                Selected Sentence:
              </span>
              <p className="text-slate-800 text-xs italic font-serif leading-relaxed">
                "{selectedText}"
              </p>
            </div>
          )}

          {/* Explanation Text */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center space-x-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-brand-600" />
              <span>Core Scientific Principle</span>
            </h4>
            <p className="text-slate-700 leading-relaxed font-normal">
              {explanation.shortExplanation}
            </p>
          </div>

          {/* Interactive Visual Model */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-brand-600" />
              <span>Interactive Visual Demonstration</span>
            </h4>
            <VisualExplainerCanvas
              animationType={explanation.visualData.animationType}
              caption={explanation.visualData.caption}
            />
          </div>

          {/* Real-World Everyday Application */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Everyday Village Observation</span>
            </div>
            <p className="text-emerald-950 text-xs leading-relaxed">
              {explanation.realWorldExample}
            </p>
          </div>

          {/* Companion Tip */}
          {explanation.companionTip && (
            <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              💡 <strong>Pro Tip:</strong> {explanation.companionTip}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Topic: <strong className="text-slate-700">{explanation.topic}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
          >
            <span>Continue Reading</span>
          </button>
        </div>
      </div>
    </div>
  );
};
