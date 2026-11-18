import { Question, Evaluation, Lang } from './types';

export function gradeLocalQuestion(
  question: Question,
  userAnswer: string | number,
  lang: Lang = 'en'
): Evaluation {
  switch (question.type) {
    case 'mcq':
    case 'scenario': {
      const selectedIndex = typeof userAnswer === 'number' ? userAnswer : parseInt(userAnswer, 10);
      const isCorrect = selectedIndex === question.correctIndex;

      const feedbackEn = isCorrect
        ? 'Correct! Excellent reasoning.'
        : 'Not quite. Think about how the scientific principle applies here.';
      const feedbackHi = isCorrect
        ? 'बिल्कुल सही! बेहतरीन समझ।'
        : 'सही नहीं है। वैज्ञानिक सिद्धांत को दोबारा सोचें।';
      const feedbackKn = isCorrect
        ? 'ಸರಿಯಾಗಿದೆ! ಅದ್ಭುತ ತಿಳುವಳಿಕೆ.'
        : 'ಸರಿಯಾಗಿಲ್ಲ. ವೈಜ್ಞಾನಿಕ ತತ್ವವನ್ನು ಮತ್ತೊಮ್ಮೆ ಪರಿಶೀಲಿಸಿ.';

      const feedback = lang === 'hi' ? feedbackHi : lang === 'kn' ? feedbackKn : feedbackEn;

      return {
        correct: isCorrect,
        score: isCorrect ? 1 : 0,
        feedback,
        nextAction: isCorrect ? 'continue' : 'hint',
      };
    }

    case 'fill_blank': {
      if (!question.blanks || question.blanks.length === 0) {
        return { correct: false, score: 0, feedback: 'Invalid question configuration', nextAction: 'retry' };
      }

      const inputStr = String(userAnswer).trim().toLowerCase().replace(/[.,!?;:]/g, '');
      const validAnswers = question.blanks[0].answer.map((a) =>
        a.trim().toLowerCase().replace(/[.,!?;:]/g, '')
      );

      const isCorrect = validAnswers.includes(inputStr);

      const feedbackEn = isCorrect
        ? 'Well done! That is the exact term.'
        : `Not quite. Expected term: ${question.blanks[0].answer[0]}`;
      const feedbackHi = isCorrect
        ? 'शाबाश! यह सही शब्द है।'
        : `सही नहीं है। अपेक्षित शब्द: ${question.blanks[0].answer[0]}`;
      const feedbackKn = isCorrect
        ? 'ಸರಿಯಾದ ಉತ್ತರ!'
        : `ಸರಿಯಾಗಿಲ್ಲ. ನಿರೀಕ್ಷಿತ ಉತ್ತರ: ${question.blanks[0].answer[0]}`;

      const feedback = lang === 'hi' ? feedbackHi : lang === 'kn' ? feedbackKn : feedbackEn;

      return {
        correct: isCorrect,
        score: isCorrect ? 1 : 0,
        feedback,
        nextAction: isCorrect ? 'continue' : 'hint',
      };
    }

    case 'numeric': {
      if (!question.numeric) {
        return { correct: false, score: 0, feedback: 'Invalid numeric configuration', nextAction: 'retry' };
      }

      // Extract number from input string (handling optional unit suffixes like "600L" or "600 m2")
      const rawStr = String(userAnswer).trim();
      const match = rawStr.match(/[-+]?[0-9]*\.?[0-9]+/);

      if (!match) {
        return {
          correct: false,
          score: 0,
          feedback: lang === 'hi' ? 'कृपया एक वैध संख्या दर्ज करें।' : lang === 'kn' ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.' : 'Please enter a valid number.',
          nextAction: 'retry',
        };
      }

      const parsedVal = parseFloat(match[0]);
      const target = question.numeric.answer;
      const tolerance = question.numeric.tolerance ?? 0.01;

      const isCorrect = Math.abs(parsedVal - target) <= tolerance;

      const feedbackEn = isCorrect
        ? `Spot on! ${target} ${question.numeric.unit ?? ''} is correct.`
        : `Incorrect. The calculated answer is ${target} ${question.numeric.unit ?? ''}.`;
      const feedbackHi = isCorrect
        ? `बिल्कुल सही! ${target} ${question.numeric.unit ?? ''} सही उत्तर है।`
        : `गलत। सही गणना ${target} ${question.numeric.unit ?? ''} है।`;
      const feedbackKn = isCorrect
        ? `ಖಚಿತವಾಗಿದೆ! ${target} ${question.numeric.unit ?? ''} ಸರಿಯಾಗಿದೆ.`
        : `ತಪ್ಪಾಗಿದೆ. ಲೆಕ್ಕಾಚಾರದ ಉತ್ತರ ${target} ${question.numeric.unit ?? ''}.`;

      const feedback = lang === 'hi' ? feedbackHi : lang === 'kn' ? feedbackKn : feedbackEn;

      return {
        correct: isCorrect,
        score: isCorrect ? 1 : 0,
        feedback,
        nextAction: isCorrect ? 'continue' : 'hint',
      };
    }

    case 'open': {
      // Local fallback for open questions before AI server is configured in Phase 5
      return {
        correct: true,
        score: 0.8,
        feedback:
          question.rubric?.modelAnswer[lang] ??
          'Good scientific thinking! Check the model answer for details.',
        nextAction: 'continue',
      };
    }

    default:
      return { correct: false, score: 0, feedback: 'Unknown question format', nextAction: 'retry' };
  }
}
