import React, { useState } from 'react';
import { Question, Evaluation, Lang } from '../../learning/types';
import { aiClient } from '../../learning/aiClient';

interface OpenAnswerProps {
  question: Question;
  lang: Lang;
  onAnswerSubmit: (evaluation: Evaluation) => void;
  evaluation: Evaluation | null;
}

export const OpenAnswerQuestion: React.FC<OpenAnswerProps> = ({
  question,
  lang,
  onAnswerSubmit,
  evaluation,
}) => {
  const [answerText, setAnswerText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attemptNumber, setAttemptNumber] = useState<number>(1);
  const [aiHint, setAiHint] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const result = await aiClient.evaluateOpenAnswer(
        question,
        answerText,
        lang,
        attemptNumber
      );
      setAttemptNumber((prev) => prev + 1);
      onAnswerSubmit(result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAiHint = async () => {
    const hint = await aiClient.getSocraticHint(question, lang);
    setAiHint(hint);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          Open Explanation Question
        </span>
        <p className="text-base font-medium text-slate-100 leading-relaxed">
          {question.text[lang] || question.text.en}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            rows={4}
            maxLength={500}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            disabled={evaluation?.correct || isLoading}
            placeholder={
              lang === 'hi'
                ? 'अपने शब्दों में वैज्ञानिक व्याख्या लिखें (अधिकतम 500 अक्षर)...'
                : lang === 'kn'
                ? 'ನಿಮ್ಮ ಸ್ವಂತ ಮಾತುಗಳಲ್ಲಿ ವೈಜ್ಞಾನಿಕ ವಿವರಣೆಯನ್ನು ಬರೆಯಿರಿ...'
                : 'Explain in your own words using scientific reasoning (max 500 characters)...'
            }
            className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl p-3.5 text-sm text-slate-100 outline-none resize-none transition-colors"
          />
          <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-500 font-mono">
            {answerText.length}/500
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleRequestAiHint}
            className="text-xs text-amber-400 hover:text-amber-300 underline flex items-center gap-1 cursor-pointer"
          >
            <span>💡</span>
            <span>{lang === 'hi' ? 'मित्रा से संकेत लें' : lang === 'kn' ? 'ಮಿತ್ರ ಮಾರ್ಗದರ್ಶನ' : 'Ask Mitra for a Hint'}</span>
          </button>

          <button
            type="submit"
            disabled={!answerText.trim() || isLoading || evaluation?.correct}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>{lang === 'hi' ? 'मित्रा मूल्यांकन कर रहे हैं...' : lang === 'kn' ? 'ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Mitra is Evaluating...'}</span>
              </>
            ) : (
              <span>{lang === 'hi' ? 'उत्तर भेजें' : lang === 'kn' ? 'ಉತ್ತರ ಸಲ್ಲಿಸಿ' : 'Submit for Evaluation'}</span>
            )}
          </button>
        </div>
      </form>

      {/* AI Socratic Hint Callout */}
      {aiHint && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200">
          <span className="font-bold text-amber-300">Mitra's Guidance: </span>
          <span>{aiHint}</span>
        </div>
      )}

      {/* Model Answer Preview after attempt */}
      {evaluation && question.rubric?.modelAnswer && (
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-xs text-slate-300 space-y-1">
          <span className="font-bold text-amber-300">
            {lang === 'hi' ? 'आदर्श वैज्ञानिक उत्तर (Model Answer):' : lang === 'kn' ? 'ಮಾದರಿ ವೈಜ್ಞಾನಿಕ ಉತ್ತರ:' : 'Model Answer:'}
          </span>
          <p className="leading-relaxed italic text-slate-200">
            "{question.rubric.modelAnswer[lang] || question.rubric.modelAnswer.en}"
          </p>
        </div>
      )}
    </div>
  );
};
