import React, { useState } from 'react';
import { Question, Evaluation, Lang } from '../../learning/types';
import { gradeLocalQuestion } from '../../learning/localGrader';

interface NumericQuestionProps {
  question: Question;
  lang: Lang;
  onAnswerSubmit: (evaluation: Evaluation) => void;
  evaluation: Evaluation | null;
}

export const NumericQuestion: React.FC<NumericQuestionProps> = ({
  question,
  lang,
  onAnswerSubmit,
  evaluation,
}) => {
  const [inputVal, setInputVal] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || evaluation?.correct) return;
    const result = gradeLocalQuestion(question, inputVal, lang);
    onAnswerSubmit(result);
  };

  return (
    <div className="space-y-4">
      <p className="text-base font-medium text-slate-100 leading-relaxed">
        {question.text[lang] || question.text.en}
      </p>

      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="number"
            step="any"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={evaluation?.correct}
            placeholder={lang === 'hi' ? 'संख्यात्मक मान लिखें' : lang === 'kn' ? 'ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ' : 'Enter calculated value'}
            className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-colors"
          />
          {question.numeric?.unit && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
              {question.numeric.unit}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={!inputVal.trim() || evaluation?.correct}
          className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition-transform active:scale-95 cursor-pointer"
        >
          {lang === 'hi' ? 'गणना जाँचें' : lang === 'kn' ? 'ಪರಿಶೀಲಿಸಿ' : 'Calculate'}
        </button>
      </form>
    </div>
  );
};
