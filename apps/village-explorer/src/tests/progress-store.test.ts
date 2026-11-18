import { describe, it, expect } from 'vitest';
import { BADGE_DEFINITIONS } from '../storage/progressStore';
import { SessionEngine } from '../learning/sessionEngine';
import { ZoneId } from '../learning/types';

describe('Progress Store & Session Engine Tests', () => {
  it('contains badge definitions for all 6 zones', () => {
    const zones: ZoneId[] = ['house', 'well', 'farm', 'tank', 'solar', 'soil'];
    zones.forEach((zone) => {
      const badge = BADGE_DEFINITIONS[zone];
      expect(badge).toBeDefined();
      expect(badge.icon).toBeTruthy();
      expect(badge.title.en).toBeTruthy();
      expect(badge.title.hi).toBeTruthy();
      expect(badge.title.kn).toBeTruthy();
      expect(badge.description.en).toBeTruthy();
    });
  });

  it('SessionEngine sorts and adapts questions for learner grade', async () => {
    const grade7Questions = await SessionEngine.getQuestionsForZone('house', 7);
    expect(grade7Questions.length).toBeGreaterThanOrEqual(6);

    // First question should match grade 7
    expect(grade7Questions[0].grade).toBe(7);
  });
});
