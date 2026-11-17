import {
  Question,
  Evaluation,
  Lang,
  CurriculumQuestionType,
  GeneratedCurriculumQuestion,
} from './types';
import {
  NcertCurriculumEntry,
  SupportedGrade,
} from './curriculum/ncertRegistry';
import { resolveCurriculumForConcept } from './curriculum/curriculumMapper';

const CLIENT_TIMEOUT_MS = 8000;

/**
 * Deterministic offline NCERT-grounded question generator used if the AI proxy is offline.
 * Guarantees verified textbook/chapter retention with zero invented references.
 */
export function buildOfflineCurriculumQuestion(
  entry: NcertCurriculumEntry,
  studentGrade: SupportedGrade,
  villageObject: string,
  questionType: CurriculumQuestionType
): GeneratedCurriculumQuestion {
  const isEnrichment =
    entry.mappingStatus === 'interdisciplinary_extension' || entry.grade > studentGrade;
  const primarySubtopic = entry.subtopic.split(',')[0].trim();

  if (questionType === 'fill_blank') {
    return {
      questionText: `Observing ${villageObject} (NCERT Class ${entry.grade} ${entry.subject}, Ch. ${entry.chapterNumber}: ${entry.chapterTitle}): Fill in the blank — this rural application demonstrates ________.`,
      questionType: 'fill_blank',
      blankAnswer: primarySubtopic,
      explanation: `${entry.explanation} (Source: NCERT ${entry.textbook}, Ch. ${entry.chapterNumber}: ${entry.chapterTitle})`,
      curriculumId: entry.curriculumId,
      grade: entry.grade,
      subject: entry.subject,
      textbook: entry.textbook,
      chapterNumber: entry.chapterNumber,
      chapterTitle: entry.chapterTitle,
      isEnrichment,
    };
  }

  return {
    questionText:
      questionType === 'critical_thinking'
        ? `Critical Thinking (${villageObject}): Based on NCERT Class ${entry.grade} Ch. ${entry.chapterNumber} (${entry.chapterTitle}), which reasoning best explains this real-world village phenomenon?`
        : questionType === 'scenario'
        ? `Village Scenario (${villageObject}): You are explaining "${entry.topic}" to a friend in Class ${studentGrade}. Which key NCERT objective applies here?`
        : `NCERT Class ${entry.grade} Practice (${villageObject}): Which statement matches the verified learning objective for "${entry.chapterTitle}"?`,
    questionType,
    options: [
      entry.learningObjective,
      `It has no connection to ${entry.subject.toLowerCase()} or ${primarySubtopic.toLowerCase()}.`,
      `Rural environments cannot demonstrate concepts from ${entry.textbook}.`,
      `The phenomenon occurs randomly without obeying natural laws.`,
    ],
    correctIndex: 0,
    explanation: `${entry.explanation} (Verified NCERT Reference: ${entry.textbook}, Ch. ${entry.chapterNumber}: ${entry.chapterTitle})`,
    curriculumId: entry.curriculumId,
    grade: entry.grade,
    subject: entry.subject,
    textbook: entry.textbook,
    chapterNumber: entry.chapterNumber,
    chapterTitle: entry.chapterTitle,
    isEnrichment,
  };
}

export const aiClient = {
  async evaluateOpenAnswer(
    question: Question,
    studentAnswer: string,
    lang: Lang,
    attemptNumber: number = 1
  ): Promise<Evaluation> {
    const keyPoints = question.rubric?.keyPoints[lang] || question.rubric?.keyPoints.en || [];
    const modelAnswer = question.rubric?.modelAnswer[lang] || question.rubric?.modelAnswer.en || '';
    const ncertEntry = resolveCurriculumForConcept(question.concept);

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
          curriculumContext: ncertEntry
            ? {
                curriculumId: ncertEntry.curriculumId,
                textbook: ncertEntry.textbook,
                chapterNumber: ncertEntry.chapterNumber,
                chapterTitle: ncertEntry.chapterTitle,
                learningObjective: ncertEntry.learningObjective,
              }
            : undefined,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[aiClient] Server responded with status ${response.status}, using graceful fallback`);
        return fallbackEval;
      }

      const result = await response.json();
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('[aiClient] AI server unreachable or timed out (offline mode active):', msg);
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

  async generateCurriculumQuestion(params: {
    entry: NcertCurriculumEntry;
    studentGrade: SupportedGrade;
    villageObject: string;
    currentActivity: string;
    questionType: CurriculumQuestionType;
    difficulty?: 1 | 2 | 3;
    lang?: Lang;
  }): Promise<GeneratedCurriculumQuestion> {
    const {
      entry,
      studentGrade,
      villageObject,
      currentActivity,
      questionType,
      difficulty = 2,
      lang = 'en',
    } = params;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

      const response = await fetch('/api/ai/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          curriculumId: entry.curriculumId,
          studentGrade,
          ncertGrade: entry.grade,
          subject: entry.subject,
          textbook: entry.textbook,
          chapterNumber: entry.chapterNumber,
          chapterTitle: entry.chapterTitle,
          subtopic: entry.subtopic,
          learningObjective: entry.learningObjective,
          villageObject,
          currentActivity,
          questionType,
          difficulty,
          lang,
          isEnrichment:
            entry.mappingStatus === 'interdisciplinary_extension' || entry.grade > studentGrade,
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return (await response.json()) as GeneratedCurriculumQuestion;
      }
    } catch {
      // Offline fallback below
    }

    return buildOfflineCurriculumQuestion(entry, studentGrade, villageObject, questionType);
  },

  async getSocraticHint(question: Question, lang: Lang): Promise<string> {
    const ncertEntry = resolveCurriculumForConcept(question.concept);
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
          chapterTitle: ncertEntry?.chapterTitle,
          grade: question.grade,
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data?.hint) return data.hint;
      }
    } catch {
      // Graceful fallback to curated hints
    }

    const curatedHints = question.hints[lang] || question.hints.en || [];
    return curatedHints[0] || 'Focus on how the scientific principle applies to this village structure.';
  },
};
