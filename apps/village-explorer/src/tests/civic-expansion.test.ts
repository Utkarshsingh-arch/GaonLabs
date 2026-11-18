import { describe, it, expect } from 'vitest';
import villageMapData from '../game/data/village.json';
import { VILLAGE_BUILDINGS } from '../game/data/villageEntities';
import { VILLAGE_NPCS, VILLAGE_EVENTS } from '../game/data/civicExpansionData';
import {
  calculateCompoundInterest,
  calculateDiscountedPrice,
  calculateJourneyMinutes,
  calculateMarketBill,
  calculateProfitLoss,
  calculateSimpleInterest,
  calculateTrainFare,
  calculateTrainSpeed,
  evaluateHouseholdBudget,
  getAllowedHealthTier,
  isHealthTopicAccessible,
} from '../learning/civicEngines';
import {
  getAllMappingsForEntity,
  resolveCurriculumForEntity,
} from '../learning/curriculum/curriculumMapper';

describe('Final Village Expansion — Hospital, Railway, Market, Bank, NPCs & Events Tests', () => {
  it('places all 4 civic centres, railway platform & active tracks cleanly on the 64x52 map', () => {
    const civicBuildings = VILLAGE_BUILDINGS.filter((b) => b.category === 'civic_center');
    expect(civicBuildings.length).toBe(4);
    expect(civicBuildings.map((b) => b.id)).toEqual(
      expect.arrayContaining([
        'village_hospital',
        'cooperative_bank',
        'village_marketplace',
        'railway_station',
      ])
    );

    const groundLayer = villageMapData.layers.find((l) => l.name === 'Ground');
    const obstacleLayer = villageMapData.layers.find((l) => l.name === 'Obstacles');

    // Southern Civic Avenue (tile 27, 41) is open and walkable
    expect(obstacleLayer?.data?.[41 * 64 + 27]).toBe(0);
    // Railway Platform (tile 50, 48) is tile 26 and walkable
    expect(groundLayer?.data?.[48 * 64 + 50]).toBe(26);
    expect(obstacleLayer?.data?.[48 * 64 + 50]).toBe(0);
    // Railway Tracks (tile 50, 49) are tile 25 and blocked so avatar stays safely on platform
    expect(groundLayer?.data?.[49 * 64 + 50]).toBe(25);
    expect(obstacleLayer?.data?.[49 * 64 + 50]).toBeGreaterThan(0);
  });

  it('enforces grade-aware content gating for Hospital reproductive health education', () => {
    expect(getAllowedHealthTier(6)).toBe('foundational');
    expect(getAllowedHealthTier(7)).toBe('middle_puberty');
    expect(getAllowedHealthTier(8)).toBe('middle_puberty');
    expect(getAllowedHealthTier(9)).toBe('secondary_repro');
    expect(getAllowedHealthTier(10)).toBe('secondary_repro');
    expect(getAllowedHealthTier(11)).toBe('senior_biology');
    expect(getAllowedHealthTier(12)).toBe('senior_biology');

    // Class 6 sees foundational hygiene/boundaries only—not advanced reproductive anatomy
    expect(isHealthTopicAccessible('foundational', 6)).toBe(true);
    expect(isHealthTopicAccessible('middle_puberty', 6)).toBe(false);
    expect(isHealthTopicAccessible('secondary_repro', 6)).toBe(false);

    // Class 7-8 unlocks puberty & menstrual hygiene, still gates senior Class 12 biology
    expect(isHealthTopicAccessible('middle_puberty', 7)).toBe(true);
    expect(isHealthTopicAccessible('secondary_repro', 8)).toBe(false);

    // Class 10 unlocks NCERT Class 10 reproduction; Class 12 unlocks all tiers
    expect(isHealthTopicAccessible('secondary_repro', 10)).toBe(true);
    expect(isHealthTopicAccessible('senior_biology', 12)).toBe(true);
  });

  it('accurately computes Railway Station speed, timetable durations, and family fares', () => {
    const spd = calculateTrainSpeed(120, 2);
    expect(spd.kmh).toBe(60);
    expect(spd.ms).toBeCloseTo(16.67, 1);

    expect(calculateJourneyMinutes('08:00', '10:00')).toBe(120);
    expect(calculateJourneyMinutes('09:00', '10:30')).toBe(90);

    const fare = calculateTrainFare(100, 2, 2, 10, 1.5);
    expect(fare.adultUnitFare).toBe(150);
    expect(fare.childUnitFare).toBe(75);
    expect(fare.subtotal).toBe(450);
    expect(fare.discountAmount).toBe(45);
    expect(fare.finalTotal).toBe(405);
  });

  it('accurately computes Village Marketplace profit/loss, discounts, and billing change', () => {
    // 10 notebooks for ₹100 (₹10 each), sold at ₹15 each -> ₹50 profit = 50%
    const pl = calculateProfitLoss(10, 15, 10);
    expect(pl.totalCP).toBe(100);
    expect(pl.totalSP).toBe(150);
    expect(pl.status).toBe('profit');
    expect(pl.amount).toBe(50);
    expect(pl.percentage).toBe(50);

    const loss = calculateProfitLoss(50, 40, 5);
    expect(loss.status).toBe('loss');
    expect(loss.percentage).toBe(20);

    const disc = calculateDiscountedPrice(400, 15);
    expect(disc.discountAmount).toBe(60);
    expect(disc.finalPrice).toBe(340);

    // 2kg rice @ ₹50 + 1kg sugar @ ₹45 + 3kg veg @ ₹30 = ₹235; paid ₹500 -> ₹265 change
    const bill = calculateMarketBill(
      [
        { unitPrice: 50, qty: 2 },
        { unitPrice: 45, qty: 1 },
        { unitPrice: 30, qty: 3 },
      ],
      500
    );
    expect(bill.totalBill).toBe(235);
    expect(bill.change).toBe(265);
    expect(bill.isSufficient).toBe(true);
  });

  it('accurately computes Cooperative Bank simple interest, compound interest, and household budgeting', () => {
    const si = calculateSimpleInterest(4000, 5, 2);
    expect(si.interest).toBe(400);
    expect(si.totalAmount).toBe(4400);

    const ci = calculateCompoundInterest(5000, 10, 2);
    expect(ci.totalAmount).toBe(6050);
    expect(ci.interest).toBe(1050);

    const budget = evaluateHouseholdBudget(12000, {
      food: 4000,
      education: 2000,
      transport: 1200,
      healthcare: 1000,
      savings: 2400,
      other: 1000,
    });
    expect(budget.totalAllocated).toBe(11600);
    expect(budget.remaining).toBe(400);
    expect(budget.isWithinBudget).toBe(true);
    expect(budget.savingsPercent).toBe(20);
  });

  it('verifies all 12 NPCs, 5 Village Events, and 4 Civic Centres have trilingual labels & verified NCERT mappings', () => {
    expect(VILLAGE_NPCS.length).toBe(12);
    for (const npc of VILLAGE_NPCS) {
      expect(npc.name.en && npc.name.hi && npc.name.kn).toBeTruthy();
      expect(npc.dialogues.en.length).toBeGreaterThanOrEqual(2);
      expect(npc.dialogues.hi.length).toBeGreaterThanOrEqual(2);
      expect(npc.dialogues.kn.length).toBeGreaterThanOrEqual(2);
      expect(getAllMappingsForEntity(npc.curriculumEntityKey).length).toBeGreaterThan(0);
    }

    expect(VILLAGE_EVENTS.length).toBe(5);
    for (const ev of VILLAGE_EVENTS) {
      expect(ev.title.en && ev.title.hi && ev.title.kn).toBeTruthy();
      expect(resolveCurriculumForEntity(ev.curriculumEntityKey, 8)).not.toBeNull();
    }

    // Specific verified NCERT anchor checks for all 4 new civic centres
    expect(resolveCurriculumForEntity('village_hospital', 7)?.chapterTitle).toContain('Adolescence');
    expect(resolveCurriculumForEntity('village_hospital', 12)?.subject).toBe('Biology');
    expect(resolveCurriculumForEntity('railway_station', 9)?.chapterTitle).toBe('Motion');
    expect(resolveCurriculumForEntity('village_marketplace', 8)?.chapterTitle).toBe('Comparing Quantities');
    expect(resolveCurriculumForEntity('cooperative_bank', 10)?.chapterTitle).toBe('Money and Credit');
  });
});
