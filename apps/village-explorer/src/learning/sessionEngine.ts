import { Question, ZoneId } from './types';
import { QUESTION_BANK } from './questionBank';
import { progressStore } from '../storage/progressStore';

export class SessionEngine {
  /**
   * Retrieves an ordered, adapted question queue for a specific zone and grade.
   */
  public static async getQuestionsForZone(
    zoneId: ZoneId,
    learnerGrade: 6 | 7 | 8
  ): Promise<Question[]> {
    const allZoneQuestions = QUESTION_BANK.filter((q) => q.zone === zoneId);
    const conceptMastery = await progressStore.getConceptMastery();

    // Map of concept -> masteryScore
    const masteryMap = new Map<string, number>();
    conceptMastery.forEach((cm) => masteryMap.set(cm.concept, cm.masteryScore));

    // Sort questions:
    // 1. Matching learner's exact grade first
    // 2. Weak concepts (< 0.6) prioritized
    // 3. Difficulty ascending
    return [...allZoneQuestions].sort((a, b) => {
      // Prioritize grade match
      const aGradeMatch = a.grade === learnerGrade ? -1 : 1;
      const bGradeMatch = b.grade === learnerGrade ? -1 : 1;
      if (aGradeMatch !== bGradeMatch) return aGradeMatch - bGradeMatch;

      // Check mastery
      const aScore = masteryMap.get(a.concept) ?? 0.5;
      const bScore = masteryMap.get(b.concept) ?? 0.5;
      if (aScore < 0.6 && bScore >= 0.6) return -1;
      if (bScore < 0.6 && aScore >= 0.6) return 1;

      // By difficulty
      return a.difficulty - b.difficulty;
    });
  }
}
