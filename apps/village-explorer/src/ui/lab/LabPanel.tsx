import React, { useState } from 'react';
import { ZoneId, Lang, Evaluation, Question } from '../../learning/types';
import { ZONE_DEFINITIONS, QUESTION_BANK } from '../../learning/questionBank';
import { QuestionRenderer } from './QuestionRenderer';
import { HintLadder } from './HintLadder';
import { LabDemoRenderer } from './demos';
import { eventBus } from '../../game/eventBus';

interface LabPanelProps {
  zoneId: ZoneId;
  lang: Lang;
  onClose: () => void;
  onQuestionAnswered?: (question: Question, evalResult: Evaluation) => void;
}

export const LabPanel: React.FC<LabPanelProps> = ({ zoneId, lang, onClose, onQuestionAnswered }) => {
  const zoneDef = ZONE_DEFINITIONS[zoneId];
  const questions = QUESTION_BANK.filter((q) => q.zone === zoneId);

  const [activeTab, setActiveTab] = useState<'experiment' | 'questions'>('experiment');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentEval, setCurrentEval] = useState<Evaluation | null>(null);
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set());
  const [isLabCompleted, setIsLabCompleted] = useState<boolean>(false);

  const activeQuestion = questions[currentIndex];

  const handleAnswerSubmit = (evalResult: Evaluation) => {
    setCurrentEval(evalResult);
    if (activeQuestion && onQuestionAnswered) {
      onQuestionAnswered(activeQuestion, evalResult);
    }
    if (evalResult.correct) {
      setCompletedQuestions((prev) => new Set(prev).add(currentIndex));
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentEval(null);
    } else {
      setIsLabCompleted(true);
      eventBus.emit('lab:completed', zoneId);
    }
  };

  if (!zoneDef || questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur">
        <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl text-center">
          <p className="text-slate-300">Lab questions loading...</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-800 rounded-lg text-sm text-slate-300">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${zoneDef.name} STEM Lab`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Lab Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-slate-800 border border-slate-700">
              {zoneDef.icon}
            </span>
            <div>
              <h2 className="text-base font-bold text-amber-400">{zoneDef.name}</h2>
              <p className="text-xs text-slate-400">
                Grade {activeQuestion?.grade ?? '6-8'} STEM Curriculum Lab
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Selector */}
        {!isLabCompleted && (
          <div className="flex border-b border-slate-800 bg-slate-900/60 px-5 pt-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('experiment')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'experiment'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🧪</span>
              <span>
                {lang === 'hi' ? 'प्रयोगशाला सिमुलेटर' : lang === 'kn' ? 'ಪ್ರಯೋಗ ಸಿಮ್ಯುಲೇಟರ್' : 'Interactive Experiment'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('questions')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'questions'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>📝</span>
              <span>
                {lang === 'hi'
                  ? `वैज्ञानिक प्रश्न (${completedQuestions.size}/${questions.length})`
                  : lang === 'kn'
                  ? `ವೈಜ್ಞಾನಿಕ ಪ್ರಶ್ನೆಗಳು (${completedQuestions.size}/${questions.length})`
                  : `STEM Questions (${completedQuestions.size}/${questions.length})`}
              </span>
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Completion Screen */}
          {isLabCompleted ? (
            <div className="py-8 text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-amber-500/20 border-2 border-amber-400 text-5xl animate-bounce">
                🏆
              </div>
              <h3 className="text-xl font-bold text-amber-300">
                {lang === 'hi' ? 'प्रयोगशाला सफलतापूर्वक पूर्ण!' : lang === 'kn' ? 'ಲ್ಯಾಬ್ ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ!' : 'Lab Completed Successfully!'}
              </h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                {lang === 'hi'
                  ? `बधाई! आपने ${zoneDef.name} के सभी वैज्ञानिक प्रश्नों को हल कर लिया है।`
                  : lang === 'kn'
                  ? `ಅಭಿನಂದನೆಗಳು! ನೀವು ${zoneDef.name} ಎಲ್ಲಾ ವೈಜ್ಞಾನಿಕ ಪ್ರಶ್ನೆಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಮುಗಿಸಿದ್ದೀರಿ.`
                  : `Congratulations! You mastered all scientific principles in the ${zoneDef.name}.`}
              </p>

              <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/50 px-4 py-2 rounded-xl text-emerald-300 font-bold text-sm">
                <span>⭐</span>
                <span>+100 STEM XP Awarded</span>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-3 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  {lang === 'hi' ? 'गाँव में वापस जाएँ' : lang === 'kn' ? 'ಗ್ರಾಮಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Return to Village'}
                </button>
              </div>
            </div>
          ) : activeTab === 'experiment' ? (
            /* Interactive Experiment Simulation Tab */
            <div className="space-y-4">
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
                <span className="text-base text-amber-400">📖</span>
                <span>{zoneDef.intro[lang] || zoneDef.intro.en}</span>
              </div>

              <LabDemoRenderer zoneId={zoneId} lang={lang} />

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('questions')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-lg"
                >
                  <span>
                    {lang === 'hi'
                      ? 'वैज्ञानिक प्रश्न हल करें'
                      : lang === 'kn'
                      ? 'ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ'
                      : 'Solve STEM Questions'}
                  </span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ) : (
            /* Questions Tab */
            <>
              {/* Progress Dots */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                <div className="flex gap-1.5">
                  {questions.map((_, idx) => {
                    const isDone = completedQuestions.has(idx);
                    const isCurrent = idx === currentIndex;
                    return (
                      <div
                        key={idx}
                        className={`h-2 rounded-full transition-all ${
                          isCurrent
                            ? 'w-6 bg-amber-400'
                            : isDone
                            ? 'w-2 bg-emerald-500'
                            : 'w-2 bg-slate-700'
                        }`}
                      />
                    );
                  })}
                </div>
                <span>
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>

              {/* Question Body */}
              <QuestionRenderer
                question={activeQuestion}
                lang={lang}
                onAnswerSubmit={handleAnswerSubmit}
                evaluation={currentEval}
              />

              {/* Hint Ladder */}
              <HintLadder hints={activeQuestion.hints} lang={lang} />

              {/* Evaluation Feedback Callout */}
              {currentEval && (
                <div
                  className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                    currentEval.correct
                      ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                      : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
                  }`}
                >
                  <p className="font-semibold mb-1">
                    {currentEval.correct ? '✓ ' : '✗ '}
                    {currentEval.feedback}
                  </p>

                  {/* Scientific Explanation Banner */}
                  {currentEval.correct && (
                    <div className="mt-2 pt-2 border-t border-emerald-500/30 text-emerald-100/90 text-xs">
                      <span className="font-bold text-amber-300">
                        {lang === 'hi' ? 'वैज्ञानिक व्याख्या: ' : lang === 'kn' ? 'ವೈಜ್ಞಾನಿಕ ವಿವರಣೆ: ' : 'Scientific Principle: '}
                      </span>
                      {activeQuestion.explanation[lang] || activeQuestion.explanation.en}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!isLabCompleted && activeTab === 'questions' && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-800 bg-slate-850">
            <span className="text-xs text-slate-400">
              Concept: <span className="font-mono text-amber-400">{activeQuestion.concept}</span>
            </span>

            {currentEval?.correct ? (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>{currentIndex + 1 === questions.length ? 'Finish Lab' : 'Next Question'}</span>
                <span>→</span>
              </button>
            ) : (
              <span className="text-xs text-slate-500 italic">
                {lang === 'hi' ? 'आगे बढ़ने के लिए सही उत्तर दें' : lang === 'kn' ? 'ಮುಂದುವರಿಯಲು ಉತ್ತರಿಸಿ' : 'Answer correctly to proceed'}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
