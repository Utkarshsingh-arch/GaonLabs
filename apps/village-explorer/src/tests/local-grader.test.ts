import { describe, it, expect } from 'vitest';
import { gradeLocalQuestion } from '../learning/localGrader';
import { QUESTION_BANK } from '../learning/questionBank';

describe('Local Grader Unit Tests (Deterministic Marking)', () => {
  it('correctly grades MCQ question', () => {
    const q = QUESTION_BANK.find((item) => item.id === 'house.g6.001')!;
    expect(q).toBeDefined();

    // Correct option index (0)
    const resultCorrect = gradeLocalQuestion(q, 0, 'en');
    expect(resultCorrect.correct).toBe(true);
    expect(resultCorrect.score).toBe(1);

    // Incorrect option index (1)
    const resultWrong = gradeLocalQuestion(q, 1, 'en');
    expect(resultWrong.correct).toBe(false);
    expect(resultWrong.score).toBe(0);
  });

  it('correctly grades fill-in-the-blank with case and whitespace insensitivity', () => {
    const q = QUESTION_BANK.find((item) => item.id === 'house.g6.003')!; // answer: "convection"
    expect(q).toBeDefined();

    // Exact lowercase
    expect(gradeLocalQuestion(q, 'convection', 'en').correct).toBe(true);

    // Mixed case with leading and trailing spaces
    expect(gradeLocalQuestion(q, '  ConVeCTion  ', 'en').correct).toBe(true);

    // Hindi translation
    expect(gradeLocalQuestion(q, 'संवहन', 'hi').correct).toBe(true);

    // Wrong answer
    expect(gradeLocalQuestion(q, 'radiation', 'en').correct).toBe(false);
  });

  it('correctly grades numeric question within tolerance and with unit suffixes', () => {
    const q = QUESTION_BANK.find((item) => item.id === 'house.g7.002')!; // target: 600, tolerance: 5
    expect(q).toBeDefined();

    // Exact numeric number
    expect(gradeLocalQuestion(q, 600, 'en').correct).toBe(true);

    // Number within tolerance (e.g. 604)
    expect(gradeLocalQuestion(q, 604, 'en').correct).toBe(true);

    // Number with unit string "600 litres"
    expect(gradeLocalQuestion(q, '600 litres', 'en').correct).toBe(true);

    // Outside tolerance (590)
    expect(gradeLocalQuestion(q, 590, 'en').correct).toBe(false);
  });

  it('grades all 6 labs successfully without errors', () => {
    const zones = ['house', 'well', 'farm', 'tank', 'solar', 'soil'];

    zones.forEach((zone) => {
      const zoneQuestions = QUESTION_BANK.filter((q) => q.zone === zone);
      expect(zoneQuestions.length).toBeGreaterThanOrEqual(6);

      // Verify each question can be evaluated
      zoneQuestions.forEach((q) => {
        let dummyAnswer: any = 0;
        if (q.type === 'fill_blank') dummyAnswer = q.blanks?.[0].answer[0] || '';
        if (q.type === 'numeric') dummyAnswer = q.numeric?.answer || 0;
        if (q.type === 'mcq' || q.type === 'scenario') dummyAnswer = q.correctIndex ?? 0;

        const evalResult = gradeLocalQuestion(q, dummyAnswer, 'en');
        expect(evalResult.correct).toBe(true);
      });
    });
  });
});
