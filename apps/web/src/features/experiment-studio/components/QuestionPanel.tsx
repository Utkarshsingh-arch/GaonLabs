import React from 'react';
import { ScientificReasoningQuestion } from '@gaonlab/shared-types';
import { HelpCircle, Check, X, ArrowRight } from 'lucide-react';

interface QuestionPanelProps {
  questions: ScientificReasoningQuestion[];
  answers: Record<string, { selectedIndex: number; isCorrect: boolean }>;
  language?: string;
  onAnswerQuestion: (questionId: string, index: number, isCorrect: boolean) => void;
  onNext: () => void;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  questions,
  answers,
  language = 'en',
  onAnswerQuestion,
  onNext,
}) => {
  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount >= questions.length;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase font-mono">
            Phase 5: Scientific Reasoning & Investigation
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {language === 'kn' ? 'ವೈಜ್ಞಾನಿಕ ತಾರ್ಕಿಕ ಪ್ರಶ್ನೆಗಳು' : 'Explain the Phenomena'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Answer the conceptual questions based on your empirical observations.
          </p>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const userAns = answers[q.id];
          const hasAnswered = userAns !== undefined;

          const prompt =
            language === 'kn' && q.promptInLanguage?.kn ? q.promptInLanguage.kn : q.prompt;
          const options =
            language === 'kn' && q.optionsInLanguage?.kn ? q.optionsInLanguage.kn : q.options;

          return (
            <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {qIndex + 1}. {prompt}
              </h4>

              <div className="space-y-2">
                {options.map((optText, optIdx) => {
                  const isSelected = hasAnswered && userAns.selectedIndex === optIdx;
                  const isCorrectOption = optIdx === q.correctOptionIndex;

                  let borderClass = 'border-slate-200 hover:border-slate-300 bg-white';
                  if (hasAnswered) {
                    if (isCorrectOption) {
                      borderClass = 'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-semibold';
                    } else if (isSelected && !userAns.isCorrect) {
                      borderClass = 'border-rose-400 bg-rose-50/60 text-rose-950';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() =>
                        onAnswerQuestion(q.id, optIdx, optIdx === q.correctOptionIndex)
                      }
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-center justify-between ${borderClass}`}
                    >
                      <span>{optText}</span>
                      {hasAnswered && (
                        <span>
                          {isCorrectOption ? (
                            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                          ) : isSelected ? (
                            <X className="w-4 h-4 text-rose-500 stroke-[3]" />
                          ) : null}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal */}
              {hasAnswered && (
                <div
                  className={`p-3.5 rounded-xl text-xs mt-3 border ${
                    userAns.isCorrect
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50/80 border-amber-200 text-amber-900'
                  }`}
                >
                  <strong className="block mb-1">
                    {userAns.isCorrect ? 'Correct scientific reasoning!' : 'Key Principle to note:'}
                  </strong>
                  <p className="leading-relaxed">
                    {language === 'kn' && q.explanationInLanguage?.kn
                      ? q.explanationInLanguage.kn
                      : q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-mono">
          {answeredCount} of {questions.length} questions completed
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!isAllAnswered}
          className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:hover:bg-brand-600 text-white font-bold rounded-xl text-sm shadow-md shadow-brand-600/20 transition"
        >
          <span>Progressive Hints & Scientific Theory</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
