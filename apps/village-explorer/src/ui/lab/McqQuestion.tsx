import React, { useState } from 'react';
import { Question, Evaluation, Lang } from '../../learning/types';
import { gradeLocalQuestion } from '../../learning/localGrader';

interface McqQuestionProps {
  question: Question;
  lang: Lang;
  onAnswerSubmit: (evaluation: Evaluation) => void;
  evaluation: Evaluation | null;
}

export const McqQuestion: React.FC<McqQuestionProps> = ({
  question,
  lang,
  onAnswerSubmit,
  evaluation,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const options = question.options?.[lang] || question.options?.en || [];

  const handleSelect = (index: number) => {
    if (evaluation?.correct) return; // Locked once answered correctly
    setSelectedIndex(index);
    const result = gradeLocalQuestion(question, index, lang);
    onAnswerSubmit(result);
  };

  return (
    <div className="space-y-4">
      <p className="text-base font-medium text-slate-100 leading-relaxed">
        {question.text[lang] || question.text.en}
      </p>

      <div className="space-y-2.5">
        {options.map((option, idx) => {
          let btnStyle = 'bg-slate-800/80 hover:bg-slate-750 border-slate-700 text-slate-200';

          if (selectedIndex === idx) {
            if (evaluation?.correct) {
              btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30';
            } else if (evaluation && !evaluation.correct) {
              btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/30';
            } else {
              btnStyle = 'bg-amber-950/60 border-amber-500 text-amber-200';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900/60 border border-slate-600 flex items-center justify-center text-xs font-mono">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="leading-snug pt-0.5">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
