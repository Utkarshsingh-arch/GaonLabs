import React from 'react';
import { Question, Evaluation, Lang } from '../../learning/types';
import { McqQuestion } from './McqQuestion';
import { FillBlankQuestion } from './FillBlankQuestion';
import { NumericQuestion } from './NumericQuestion';
import { OpenAnswerQuestion } from './OpenAnswerQuestion';

interface QuestionRendererProps {
  question: Question;
  lang: Lang;
  onAnswerSubmit: (evaluation: Evaluation) => void;
  evaluation: Evaluation | null;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  lang,
  onAnswerSubmit,
  evaluation,
}) => {
  switch (question.type) {
    case 'mcq':
    case 'scenario':
      return (
        <McqQuestion
          question={question}
          lang={lang}
          onAnswerSubmit={onAnswerSubmit}
          evaluation={evaluation}
        />
      );

    case 'fill_blank':
      return (
        <FillBlankQuestion
          question={question}
          lang={lang}
          onAnswerSubmit={onAnswerSubmit}
          evaluation={evaluation}
        />
      );

    case 'numeric':
      return (
        <NumericQuestion
          question={question}
          lang={lang}
          onAnswerSubmit={onAnswerSubmit}
          evaluation={evaluation}
        />
      );

    case 'open':
      return (
        <OpenAnswerQuestion
          question={question}
          lang={lang}
          onAnswerSubmit={onAnswerSubmit}
          evaluation={evaluation}
        />
      );

    default:
      return (
        <div className="text-sm text-slate-400">
          Unsupported question type: {question.type}
        </div>
      );
  }
};

