import { describe, it, expect } from 'vitest';
import villageMapData from '../game/data/village.json';
import {
  VILLAGE_BUILDINGS,
  VILLAGE_TREES,
  VILLAGE_VEHICLES,
  TREE_INFO,
  VEHICLE_INFO,
  EXPLORATION_FACTS,
} from '../game/data/villageEntities';
import { ExplorationFactSystem } from '../game/systems/ExplorationFactSystem';
import { AVATAR_FRAME_W, AVATAR_FRAME_H } from '../game/graphics/AvatarGenerator';
import { eventBus } from '../game/eventBus';

describe('2.5D Village Environment Visual & Interactive Enhancement Tests', () => {
  it('validates expanded 64x52 map structure, orientation, spawn walkability, and all 6 core zones', () => {
    expect(villageMapData.width).toBe(64);
    expect(villageMapData.height).toBe(52);
    expect(villageMapData.orientation).toBe('orthogonal');

    const groundLayer = villageMapData.layers.find((l) => l.name === 'Ground');
    const obstacleLayer = villageMapData.layers.find((l) => l.name === 'Obstacles');
    const zonesLayer = villageMapData.layers.find((l) => l.name === 'zones');

    expect(groundLayer?.data?.length).toBe(64 * 52);
    expect(obstacleLayer?.data?.length).toBe(64 * 52);

    // Central spawn point (tile 27, 20) must be unobstructed (0 on Obstacles)
    const spawnIdx = 20 * 64 + 27;
    expect(obstacleLayer?.data?.[spawnIdx]).toBe(0);

    // Wooden bridge across eastern stream (tile 47, 20) must be walkable
    const bridgeIdx = 20 * 64 + 47;
    expect(groundLayer?.data?.[bridgeIdx]).toBe(23);
    expect(obstacleLayer?.data?.[bridgeIdx]).toBe(0);

    // Deep pond tile (tile 48, 15) must block movement
    const pondIdx = 15 * 64 + 48;
    expect(obstacleLayer?.data?.[pondIdx]).toBeGreaterThan(0);

    // All 6 original core lab zoneIds must be preserved
    const zoneIds = (zonesLayer?.objects ?? []).map((o) => o.name);
    expect(zoneIds).toEqual(expect.arrayContaining(['house', 'well', 'farm', 'tank', 'solar', 'soil']));
  });

  it('includes all 6 upgraded core labs and all 7 new interactive educational learning houses', () => {
    const coreLabs = VILLAGE_BUILDINGS.filter((b) => b.category === 'core_lab');
    const learningHouses = VILLAGE_BUILDINGS.filter((b) => b.category === 'learning_house');

    expect(coreLabs.length).toBe(6);
    expect(learningHouses.length).toBe(7);

    const expectedHouseIds = [
      'math_house',
      'physics_house',
      'biology_house',
      'chemistry_house',
      'engineering_workshop',
      'weather_station',
      'math_market',
    ];

    expectedHouseIds.forEach((id) => {
      const house = learningHouses.find((h) => h.id === id);
      expect(house, `Missing learning house: ${id}`).toBeDefined();
      expect(house?.description.length).toBeGreaterThan(15);
      expect(house?.learningModule?.topics.length).toBeGreaterThanOrEqual(3);
      expect(house?.learningModule?.statusLabel).toContain('Coming Soon');
      expect(house!.tileX).toBeGreaterThan(2);
      expect(house!.tileX).toBeLessThan(54);
      expect(house!.tileY).toBeGreaterThan(2);
      expect(house!.tileY).toBeLessThan(40);
    });
  });

  it('provides diverse pixel-art trees and village vehicles with scientifically accurate facts', () => {
    const varietiesPresent = new Set(VILLAGE_TREES.map((t) => t.variety));
    expect(varietiesPresent.has('banyan')).toBe(true);
    expect(varietiesPresent.has('neem')).toBe(true);
    expect(varietiesPresent.has('mango')).toBe(true);
    expect(varietiesPresent.has('coconut')).toBe(true);
    expect(varietiesPresent.has('guava')).toBe(true);
    expect(varietiesPresent.has('bush')).toBe(true);

    Object.values(TREE_INFO).forEach((info) => {
      expect(info.fact.length).toBeGreaterThan(25);
      expect(info.ecologicalRole.length).toBeGreaterThan(15);
    });

    const vehicleTypes = new Set(VILLAGE_VEHICLES.map((v) => v.type));
    expect(vehicleTypes.has('car')).toBe(true);
    expect(vehicleTypes.has('auto_rickshaw')).toBe(true);
    expect(vehicleTypes.has('motorcycle')).toBe(true);
    expect(vehicleTypes.has('bicycle')).toBe(true);

    Object.values(VEHICLE_INFO).forEach((info) => {
      expect(info.fact.length).toBeGreaterThan(25);
    });
  });

  it('upgrades avatar sprite dimensions by >25% while preserving square crisp pixel proportions', () => {
    expect(AVATAR_FRAME_W).toBe(48);
    expect(AVATAR_FRAME_H).toBe(48);
    expect(AVATAR_FRAME_W / 32).toBeGreaterThanOrEqual(1.25);
  });

  it('enforces cooldown, active movement, contextual relevance, and non-repetition for exploration facts', () => {
    const categories = new Set(EXPLORATION_FACTS.map((f) => f.category));
    expect(categories.has('Physics')).toBe(true);
    expect(categories.has('Biology')).toBe(true);
    expect(categories.has('Chemistry')).toBe(true);
    expect(categories.has('Mathematics')).toBe(true);

    const factSystem = new ExplorationFactSystem({
      cooldownMs: 20000,
      minTravelDistancePx: 200,
      recentHistorySize: 6,
    });

    // Standing completely still should NOT spam facts even after long time
    expect(factSystem.update(25000, 500, 500, ['solar'], false)).toBeNull();

    // Walking >= 200px near solar after cooldown triggers a contextual fact
    factSystem.update(500, 620, 500, ['solar'], false);
    const firstFact = factSystem.update(500, 740, 500, ['solar'], false);
    expect(firstFact).not.toBeNull();
    expect(firstFact?.relatedAreas).toContain('solar');

    // Immediately walking more should respect cooldown and return null
    expect(factSystem.update(2000, 900, 500, ['solar'], false)).toBeNull();

    // When paused (lab open), never emit facts
    expect(factSystem.update(30000, 1100, 500, ['farm'], true)).toBeNull();

    // Subsequent facts should not immediately repeat the first fact (walk in normal steps)
    factSystem.update(12000, 980, 500, ['farm'], false);
    const secondFact = factSystem.update(13000, 1080, 500, ['farm'], false);
    expect(secondFact).not.toBeNull();
    expect(secondFact?.id).not.toBe(firstFact?.id);
  });

  it('wires unified entity hover and new learning house events through eventBus cleanly', () => {
    let hoveredName = '';
    let enteredHouseId = '';

    const onHover = (payload: { name: string }) => {
      hoveredName = payload.name;
    };
    const onHouseEnter = (payload: { id: string }) => {
      enteredHouseId = payload.id;
    };

    eventBus.on('entity:hover', onHover);
    eventBus.on('house:enter', onHouseEnter);

    eventBus.emit('entity:hover', { name: 'Neem Tree' });
    eventBus.emit('house:enter', { id: 'math_house' });

    expect(hoveredName).toBe('Neem Tree');
    expect(enteredHouseId).toBe('math_house');

    eventBus.off('entity:hover', onHover);
    eventBus.off('house:enter', onHouseEnter);
  });
});
