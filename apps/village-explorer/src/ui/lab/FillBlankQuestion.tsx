import React, { useState } from 'react';
import { Question, Evaluation, Lang } from '../../learning/types';
import { gradeLocalQuestion } from '../../learning/localGrader';

interface FillBlankProps {
  question: Question;
  lang: Lang;
  onAnswerSubmit: (evaluation: Evaluation) => void;
  evaluation: Evaluation | null;
}

export const FillBlankQuestion: React.FC<FillBlankProps> = ({
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

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          disabled={evaluation?.correct}
          placeholder={lang === 'hi' ? 'उत्तर यहाँ लिखें...' : lang === 'kn' ? 'ಉತ್ತರವನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...' : 'Type your answer here...'}
          className="flex-1 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || evaluation?.correct}
          className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-5 py-3 rounded-xl text-sm transition-transform active:scale-95 cursor-pointer"
        >
          {lang === 'hi' ? 'जाँचें' : lang === 'kn' ? 'ಪರಿಶೀಲಿಸಿ' : 'Check'}
        </button>
      </form>
    </div>
  );
};
