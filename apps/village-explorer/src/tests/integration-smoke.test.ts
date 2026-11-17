import { describe, it, expect } from 'vitest';
import { QUESTION_BANK, ZONE_DEFINITIONS } from '../learning/questionBank';
import { gradeLocalQuestion } from '../learning/localGrader';
import { MockAiProvider } from '../../server/providers/mock';
import { EvaluationSchema, buildEvaluatorPrompt } from '../../server/prompts';
import { progressStore, BADGE_DEFINITIONS } from '../storage/progressStore';
import { ZoneId } from '../learning/types';

describe('Phase 8: Comprehensive STEM Living Lab Integration & Smoke Tests', () => {
  const allZones: ZoneId[] = ['house', 'well', 'farm', 'tank', 'solar', 'soil'];
  const mockAi = new MockAiProvider();

  it('verifies all 6 village zones have definitions, badges, and curriculum questions', () => {
    allZones.forEach((zid) => {
      // Zone definition check
      expect(ZONE_DEFINITIONS[zid]).toBeDefined();
      expect(ZONE_DEFINITIONS[zid].name).toBeTruthy();

      // Badge definition check
      expect(BADGE_DEFINITIONS[zid]).toBeDefined();
      expect(BADGE_DEFINITIONS[zid].icon).toBeTruthy();

      // Curriculum questions check
      const zoneQuestions = QUESTION_BANK.filter((q) => q.zone === zid);
      expect(zoneQuestions.length).toBeGreaterThanOrEqual(6);
    });
  });

  it('verifies questions span Grades 6, 7, and 8 for every zone', () => {
    allZones.forEach((zid) => {
      const zoneQuestions = QUESTION_BANK.filter((q) => q.zone === zid);
      const grades = new Set(zoneQuestions.map((q) => q.grade));

      expect(grades.has(6), `Zone ${zid} missing Grade 6 questions`).toBe(true);
      expect(grades.has(7), `Zone ${zid} missing Grade 7 questions`).toBe(true);
      expect(grades.has(8), `Zone ${zid} missing Grade 8 questions`).toBe(true);
    });
  });

  it('evaluates every MCQ and Scenario question deterministically with localGrader', () => {
    const choiceQuestions = QUESTION_BANK.filter((q) => q.type === 'mcq' || q.type === 'scenario');
    expect(choiceQuestions.length).toBeGreaterThan(0);

    choiceQuestions.forEach((q) => {
      // 1. Correct option
      const correctEval = gradeLocalQuestion(q, q.correctIndex!);
      expect(correctEval.correct, `Question ${q.id} failed to evaluate correct index`).toBe(true);
      expect(correctEval.score).toBe(1.0);

      // 2. Incorrect option
      const wrongIndex = (q.correctIndex! + 1) % 4;
      const wrongEval = gradeLocalQuestion(q, wrongIndex);
      expect(wrongEval.correct, `Question ${q.id} marked wrong index as correct`).toBe(false);
      expect(wrongEval.score).toBe(0.0);
    });
  });

  it('evaluates every Numeric and FillBlank question accurately', () => {
    const numericQuestions = QUESTION_BANK.filter((q) => q.type === 'numeric');
    numericQuestions.forEach((q) => {
      const result = gradeLocalQuestion(q, q.numeric!.answer);
      expect(result.correct, `Numeric question ${q.id} failed with exact answer`).toBe(true);
      expect(result.score).toBe(1.0);
    });

    const fillBlankQuestions = QUESTION_BANK.filter((q) => q.type === 'fill_blank');
    fillBlankQuestions.forEach((q) => {
      const acceptedAnswers = q.blanks![0].answer;
      acceptedAnswers.forEach((ans) => {
        const result = gradeLocalQuestion(q, ans);
        expect(result.correct, `FillBlank ${q.id} failed accepted answer: '${ans}'`).toBe(true);
      });
    });
  });

  it('evaluates all Open-Ended rubric questions via AI evaluator schema without exceptions', async () => {
    const openQuestions = QUESTION_BANK.filter((q) => q.type === 'open');
    expect(openQuestions.length).toBe(6); // 1 per zone

    for (const q of openQuestions) {
      const prompt = buildEvaluatorPrompt(
        q.grade,
        'en',
        q.text.en,
        q.rubric!.keyPoints.en,
        q.rubric!.modelAnswer.en,
        q.rubric!.modelAnswer.en, // Provide model answer as student answer
        1
      );

      const evaluation = await mockAi.generateJson(prompt, EvaluationSchema);
      expect(evaluation.correct, `Open question ${q.id} failed model answer evaluation`).toBe(true);
      expect(evaluation.score).toBeGreaterThanOrEqual(0.6);
      expect(evaluation.feedback.length).toBeGreaterThan(0);
    }
  });

  it('tracks learner progress, concept attempts, and unlocks badges across zones', async () => {
    await progressStore.saveProfile({
      nickname: 'Asha',
      grade: 8,
      lang: 'hi',
      avatarId: 'avatar_1',
    });

    // Complete House and Farm labs
    const houseBadge = await progressStore.completeLab('house', 1.0, 8);
    expect(houseBadge.zoneId).toBe('house');

    const farmBadge = await progressStore.completeLab('farm', 1.0, 8);
    expect(farmBadge.zoneId).toBe('farm');

    const badges = await progressStore.getBadges();
    expect(badges.length).toBeGreaterThanOrEqual(2);

    const completed = await progressStore.getCompletedLabs();
    expect(completed.some((c) => c.zoneId === 'house')).toBe(true);
    expect(completed.some((c) => c.zoneId === 'farm')).toBe(true);
  });
});
