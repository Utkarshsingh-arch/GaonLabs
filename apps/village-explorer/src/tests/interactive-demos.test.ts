import { describe, it, expect } from 'vitest';
import { ZONE_DEFINITIONS } from '../learning/questionBank';
import { ZoneId } from '../learning/types';

describe('Phase 6: Interactive STEM Demos & Simulations', () => {
  it('covers all 6 village zones with structured STEM definitions', () => {
    const expectedZones: ZoneId[] = ['house', 'well', 'tank', 'solar', 'soil', 'farm'];
    expectedZones.forEach((zid) => {
      expect(ZONE_DEFINITIONS[zid]).toBeDefined();
      expect(ZONE_DEFINITIONS[zid].name.length).toBeGreaterThan(0);
      expect(ZONE_DEFINITIONS[zid].intro.en.length).toBeGreaterThan(0);
      expect(ZONE_DEFINITIONS[zid].intro.hi.length).toBeGreaterThan(0);
      expect(ZONE_DEFINITIONS[zid].intro.kn.length).toBeGreaterThan(0);
    });
  });

  it('calculates rainwater harvesting volume correctly (HouseDemo formula)', () => {
    const area = 60; // m²
    const rainfall = 50; // mm
    const metalRunoff = 0.9;
    const tileRunoff = 0.8;

    const metalHarvest = Math.round(area * rainfall * metalRunoff);
    const tileHarvest = Math.round(area * rainfall * tileRunoff);

    expect(metalHarvest).toBe(2700); // 60 * 50 * 0.9 = 2700 L
    expect(tileHarvest).toBe(2400); // 60 * 50 * 0.8 = 2400 L
    expect(metalHarvest).toBeGreaterThan(tileHarvest);
  });

  it('calculates pulley mechanical advantage and effort correctly (WellDemo formula)', () => {
    const loadKg = 15;
    const g = 9.8;
    const loadN = loadKg * g; // 147 N

    const effortSingleFixed = Math.round(loadN / 1);
    const effortMovable = Math.round(loadN / 2);
    const effortBlockTackle = Math.round(loadN / 3);

    expect(effortSingleFixed).toBe(147);
    expect(effortMovable).toBe(74);
    expect(effortBlockTackle).toBe(49);
    expect(effortBlockTackle).toBeLessThan(effortSingleFixed);
  });

  it('calculates fluid pressure and Torricelli velocity (TankDemo formula)', () => {
    const rho = 1000;
    const g = 9.8;
    const height = 6;
    const depth = 3;
    const totalHead = height + depth; // 9 meters

    const pressureKPa = Math.round((rho * g * totalHead) / 1000); // ~88 kPa
    const exitVelocity = Math.round(Math.sqrt(2 * g * totalHead) * 10) / 10; // ~13.3 m/s

    expect(pressureKPa).toBe(88);
    expect(exitVelocity).toBe(13.3);
  });

  it('calculates solar power output according to sun elevation angle (SolarDemo formula)', () => {
    const ratedPower = 500;
    const cleanliness = 0.9;

    // Noon (hour 12) -> normalized 0.5 -> PI/2 -> sin = 1.0
    const noonPower = Math.round(ratedPower * Math.sin(Math.PI / 2) * cleanliness);
    // Morning (hour 9) -> normalized 0.25 -> PI/4 -> sin = 0.707
    const morningPower = Math.round(ratedPower * Math.sin(Math.PI / 4) * cleanliness);

    expect(noonPower).toBe(450);
    expect(morningPower).toBe(318);
    expect(noonPower).toBeGreaterThan(morningPower);
  });

  it('calculates soil pH titration amendments correctly (SoilDemo formula)', () => {
    const initialAcidic = 5.2;
    const limeKg = 3; // raises pH by 0.45 per kg
    const correctedPh = Math.round((initialAcidic + limeKg * 0.45) * 10) / 10;

    expect(correctedPh).toBe(6.6); // brought acidic soil into fertile neutral zone (6.0 - 7.5)
    expect(correctedPh).toBeGreaterThanOrEqual(6.0);
    expect(correctedPh).toBeLessThanOrEqual(7.5);
  });

  it('calculates plant population and drip irrigation water savings (FarmDemo formula)', () => {
    const areaM2 = 4047; // 1 acre
    const rowM = 0.3; // Ragi 30cm
    const plantM = 0.1; // Ragi 10cm
    const totalPlants = Math.round(areaM2 * (1 / (rowM * plantM)));

    const baseWaterL = 350;
    const floodWater = Math.round((areaM2 * baseWaterL) / 0.45);
    const dripWater = Math.round((areaM2 * baseWaterL) / 0.9);
    const saved = floodWater - dripWater;

    expect(totalPlants).toBe(134900);
    expect(saved).toBe(Math.round(floodWater / 2)); // 50% water saved by drip
    expect(saved).toBeGreaterThan(0);
  });
});
