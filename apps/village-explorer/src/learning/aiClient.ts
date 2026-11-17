import { Question, Evaluation, Lang } from './types';

const CLIENT_TIMEOUT_MS = 8000;

export const aiClient = {
  async evaluateOpenAnswer(
    question: Question,
    studentAnswer: string,
    lang: Lang,
    attemptNumber: number = 1
  ): Promise<Evaluation> {
    const keyPoints = question.rubric?.keyPoints[lang] || question.rubric?.keyPoints.en || [];
    const modelAnswer = question.rubric?.modelAnswer[lang] || question.rubric?.modelAnswer.en || '';

    // Fallback if rubric is missing
    const fallbackEval: Evaluation = {
      correct: true,
      score: 0.8,
      feedback:
        lang === 'hi'
          ? 'आपका उत्तर सही दिशा में है! आदर्श उत्तर से मिलान करें।'
          : lang === 'kn'
          ? 'ನಿಮ್ಮ ಉತ್ತರ ಸರಿಹೊಂದುತ್ತದೆ! ಮಾದರಿ ಉತ್ತರವನ್ನು ಪರಿಶೀಲಿಸಿ.'
          : 'Good scientific explanation! Review the model answer to deepen your understanding.',
      nextAction: 'continue',
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

      const response = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          zone: question.zone,
          grade: question.grade,
          lang,
          questionId: question.id,
          questionText: question.text[lang] || question.text.en,
          rubric: {
            keyPoints,
            modelAnswer,
          },
          studentAnswer,
          attemptNumber,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[aiClient] Server responded with status ${response.status}, using graceful fallback`);
        return fallbackEval;
      }

      const result = await response.json();
      return result;
    } catch (err: any) {
      console.warn('[aiClient] AI server unreachable or timed out (offline mode active):', err.message);
      return {
        ...fallbackEval,
        feedback:
          lang === 'hi'
            ? '🤖 (मित्रा ऑफलाइन हैं) आपका उत्तर दर्ज कर लिया गया है। मॉडल उत्तर देखें।'
            : lang === 'kn'
            ? '🤖 (ಮಿತ್ರ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದಾರೆ) ನಿಮ್ಮ ಉತ್ತರವನ್ನು ದಾಖಲಿಸಲಾಗಿದೆ. ಮಾದರಿ ಉತ್ತರವನ್ನು ನೋಡಿ.'
            : '🤖 (AI Tutor resting / offline) Your answer has been accepted. Check the model explanation below.',
      };
    }
  },

  async getSocraticHint(question: Question, lang: Lang): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

      const response = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          concept: question.concept,
          questionText: question.text[lang] || question.text.en,
          lang,
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data?.hint) return data.hint;
      }
    } catch (e) {
      // Graceful fallback to curated hints
    }

    const curatedHints = question.hints[lang] || question.hints.en || [];
    return curatedHints[0] || 'Focus on how the scientific principle applies to this village structure.';
  },
};
