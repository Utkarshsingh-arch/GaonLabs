import React, { useState } from 'react';
import {
  NcertCurriculumEntry,
  SupportedGrade,
} from '../../learning/curriculum/ncertRegistry';
import {
  getAllMappingsForEntity,
  resolveCurriculumForEntity,
} from '../../learning/curriculum/curriculumMapper';
import {
  CurriculumQuestionType,
  GeneratedCurriculumQuestion,
  Lang,
} from '../../learning/types';
import { aiClient } from '../../learning/aiClient';

export interface NcertModalTarget {
  entityKey: string;
  objectName: string;
  objectIcon: string;
  /** Optional specific entry (e.g. from a specific question bank item) */
  fixedEntry?: NcertCurriculumEntry;
}

interface NcertConceptModalProps {
  target: NcertModalTarget;
  studentGrade: SupportedGrade;
  lang: Lang;
  onClose: () => void;
}

const QUESTION_TYPE_LABELS: Array<{ id: CurriculumQuestionType; label: string }> = [
  { id: 'mcq', label: 'MCQ' },
  { id: 'scenario', label: 'Scenario' },
  { id: 'application', label: 'Application' },
  { id: 'fill_blank', label: 'Fill Blank' },
  { id: 'critical_thinking', label: 'Critical Thinking' },
];

export const NcertConceptModal: React.FC<NcertConceptModalProps> = ({
  target,
  studentGrade,
  lang,
  onClose,
}) => {
  const allMappings = target.fixedEntry
    ? [target.fixedEntry]
    : getAllMappingsForEntity(target.entityKey);

  const initialEntry =
    target.fixedEntry ||
    resolveCurriculumForEntity(target.entityKey, studentGrade) ||
    allMappings[0] ||
    null;

  const [selectedEntry, setSelectedEntry] = useState<NcertCurriculumEntry | null>(initialEntry);
  const [questionType, setQuestionType] = useState<CurriculumQuestionType>('mcq');
  const [generatedQ, setGeneratedQ] = useState<GeneratedCurriculumQuestion | null>(null);
  const [isLoadingQ, setIsLoadingQ] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [blankInput, setBlankInput] = useState('');
  const [checkedAnswer, setCheckedAnswer] = useState(false);

  if (!selectedEntry) {
    return null;
  }

  const handleSelectEntry = (entry: NcertCurriculumEntry) => {
    setSelectedEntry(entry);
    setGeneratedQ(null);
    setSelectedOption(null);
    setBlankInput('');
    setCheckedAnswer(false);
  };

  const handleGenerateQuestion = async () => {
    setIsLoadingQ(true);
    setSelectedOption(null);
    setBlankInput('');
    setCheckedAnswer(false);
    try {
      const q = await aiClient.generateCurriculumQuestion({
        entry: selectedEntry,
        studentGrade,
        villageObject: target.objectName,
        currentActivity: selectedEntry.activityType,
        questionType,
        difficulty: studentGrade >= 9 ? 3 : studentGrade >= 7 ? 2 : 1,
        lang,
      });
      setGeneratedQ(q);
    } finally {
      setIsLoadingQ(false);
    }
  };

  const isEnrichment =
    selectedEntry.mappingStatus === 'interdisciplinary_extension' ||
    selectedEntry.grade > studentGrade;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`NCERT Concept — ${target.objectName}`}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/95">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl p-2 rounded-xl bg-slate-800 border border-slate-700 shrink-0">
              {target.objectIcon}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-amber-400 truncate">
                  {target.objectName}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                  Student: Class {studentGrade}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                Official NCERT Curriculum Alignment
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close NCERT concept explorer"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Multi-grade selector pills if multiple NCERT chapters map to this object */}
          {allMappings.length > 1 && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                NCERT Progression Across Classes
              </p>
              <div className="flex flex-wrap gap-1.5">
                {allMappings.map((entry) => {
                  const active = entry.curriculumId === selectedEntry.curriculumId;
                  return (
                    <button
                      key={entry.curriculumId}
                      type="button"
                      onClick={() => handleSelectEntry(entry)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                        active
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      Class {entry.grade} {entry.subject === 'Social Science (Geography)' ? 'Geography' : entry.subject} • Ch.{entry.chapterNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Verified NCERT Reference Card */}
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold text-emerald-300">
                Class {selectedEntry.grade} — {selectedEntry.subject}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  selectedEntry.mappingStatus === 'verified'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                }`}
              >
                {selectedEntry.mappingStatus === 'verified'
                  ? '✓ Verified NCERT'
                  : '🔬 Interdisciplinary STEM Extension'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                  NCERT Textbook
                </span>
                <span className="font-semibold text-slate-100">{selectedEntry.textbook}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {selectedEntry.source.edition}
                </span>
              </div>
              <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                  Chapter & Reference ID
                </span>
                <span className="font-semibold text-amber-300">
                  Ch. {selectedEntry.chapterNumber}: {selectedEntry.chapterTitle}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                  {selectedEntry.curriculumId}
                </span>
              </div>
            </div>

            <div className="text-xs space-y-1.5 pt-1">
              <p className="text-slate-200">
                <span className="font-bold text-sky-300">Subtopic: </span>
                {selectedEntry.subtopic}
              </p>
              <p className="text-slate-200">
                <span className="font-bold text-emerald-300">Learning Objective: </span>
                {selectedEntry.learningObjective}
              </p>
              <p className="text-slate-300">
                <span className="font-bold text-amber-300">Village Application: </span>
                {selectedEntry.application}
              </p>
            </div>

            {selectedEntry.extensionNote && (
              <p className="text-[11px] text-amber-200 bg-amber-950/40 border border-amber-500/30 rounded-lg p-2.5">
                ℹ️ {selectedEntry.extensionNote}
              </p>
            )}

            <div className="pt-1 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">
                Activity Type: <strong className="text-slate-200">{selectedEntry.activityType}</strong>
              </span>
              <a
                href={selectedEntry.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 underline font-semibold"
              >
                Official NCERT Portal ↗
              </a>
            </div>
          </div>

          {/* Simple Student Explanation */}
          <div className="bg-emerald-950/35 border border-emerald-500/30 rounded-xl p-3.5">
            <h3 className="text-xs font-bold text-emerald-300 mb-1">
              💡 Simple Explanation
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">{selectedEntry.explanation}</p>
          </div>

          {/* Curriculum-Aligned AI Question Generator */}
          <div className="bg-slate-800/50 border border-sky-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <h3 className="text-xs font-bold text-sky-300">
                  ✨ NCERT-Aligned Practice Question (Class {studentGrade})
                </h3>
                <p className="text-[11px] text-slate-400">
                  Grounded strictly in {selectedEntry.textbook}, Ch. {selectedEntry.chapterNumber}
                  {isEnrichment ? ' (Enrichment)' : ''}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {QUESTION_TYPE_LABELS.map((qt) => (
                <button
                  key={qt.id}
                  type="button"
                  onClick={() => setQuestionType(qt.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer ${
                    questionType === qt.id
                      ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {qt.label}
                </button>
              ))}

              <button
                type="button"
                disabled={isLoadingQ}
                onClick={handleGenerateQuestion}
                className="ml-auto px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow cursor-pointer disabled:opacity-60"
              >
                {isLoadingQ ? 'Generating...' : 'Generate Question'}
              </button>
            </div>

            {generatedQ && (
              <div className="mt-2 bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400">
                  <span className="font-mono text-amber-300">{generatedQ.curriculumId}</span>
                  <span>
                    Class {generatedQ.grade} • Ch. {generatedQ.chapterNumber}: {generatedQ.chapterTitle}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-100 leading-relaxed">
                  {generatedQ.questionText}
                </p>

                {generatedQ.questionType === 'fill_blank' ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={blankInput}
                      onChange={(e) => setBlankInput(e.target.value)}
                      placeholder="Type your answer..."
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setCheckedAnswer(true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
                    >
                      Check
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {(generatedQ.options || []).map((opt, idx) => {
                      const isPicked = selectedOption === idx;
                      const isCorrectOpt = idx === (generatedQ.correctIndex ?? 0);
                      let cls = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500';
                      if (checkedAnswer) {
                        if (isCorrectOpt) cls = 'bg-emerald-950/80 border-emerald-400 text-emerald-200';
                        else if (isPicked) cls = 'bg-rose-950/80 border-rose-400 text-rose-200';
                      } else if (isPicked) {
                        cls = 'bg-sky-950/80 border-sky-400 text-sky-100';
                      }
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedOption(idx);
                            setCheckedAnswer(true);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer ${cls}`}
                        >
                          <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {checkedAnswer && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/35 text-xs text-emerald-200 leading-relaxed">
                    {generatedQ.blankAnswer && (
                      <p className="font-bold text-amber-300 mb-1">
                        Expected Key Concept: {generatedQ.blankAnswer}
                      </p>
                    )}
                    <p>{generatedQ.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/95 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
