import { describe, it, expect } from 'vitest';
import {
  NCERT_CURRICULUM_REGISTRY,
  SupportedGrade,
} from '../learning/curriculum/ncertRegistry';
import {
  ENTITY_CURRICULUM_MAP,
  getAllMappingsForEntity,
  resolveCurriculumForConcept,
  resolveCurriculumForEntity,
  resolveEntityKeyFromRuntimeId,
} from '../learning/curriculum/curriculumMapper';
import {
  VILLAGE_BUILDINGS,
  TREE_INFO,
  VEHICLE_INFO,
  EXPLORATION_FACTS,
} from '../game/data/villageEntities';
import { QUESTION_BANK } from '../learning/questionBank';
import {
  buildCurriculumQuestionPrompt,
  GeneratedCurriculumQuestionSchema,
} from '../../server/prompts';
import { MockAiProvider } from '../../server/providers/mock';
import { buildOfflineCurriculumQuestion } from '../learning/aiClient';

describe('Comprehensive NCERT Curriculum Mapping & AI Grounding Tests', () => {
  it('ensures every NCERT registry entry uses official ncert.nic.in sources and respects Class 6-10 integrated Science', () => {
    const entries = Object.values(NCERT_CURRICULUM_REGISTRY);
    expect(entries.length).toBeGreaterThanOrEqual(40);

    for (const entry of entries) {
      expect(entry.source.publisher).toBe('NCERT');
      expect(entry.source.url.startsWith('https://ncert.nic.in/')).toBe(true);
      expect(entry.chapterNumber).toBeGreaterThanOrEqual(1);
      expect(entry.chapterTitle.length).toBeGreaterThan(2);
      expect(entry.learningObjective.length).toBeGreaterThan(15);

      // Classes 6-10 never invent separate Physics/Chemistry/Biology textbooks
      if (entry.grade <= 10) {
        expect([
          'Science',
          'Mathematics',
          'Social Science (Geography)',
          'Social Science (Economics)',
        ]).toContain(entry.subject);
      }

      // Must never cite dropped rationalised Class 10 chapter "Sources of Energy"
      expect(entry.chapterTitle.toLowerCase()).not.toBe('sources of energy');
    }
  });

  it('maps 100% of buildings (6 core labs, 7 learning houses, 3 cottages), trees, vehicles, terrain features, and exploration facts', () => {
    for (const b of VILLAGE_BUILDINGS) {
      const mappings = getAllMappingsForEntity(b.id);
      expect(mappings.length, `Unmapped building: ${b.id}`).toBeGreaterThan(0);
    }

    for (const variety of Object.keys(TREE_INFO)) {
      const mappings = getAllMappingsForEntity(variety);
      expect(mappings.length, `Unmapped tree: ${variety}`).toBeGreaterThan(0);
    }

    for (const vType of Object.keys(VEHICLE_INFO)) {
      const mappings = getAllMappingsForEntity(vType);
      expect(mappings.length, `Unmapped vehicle: ${vType}`).toBeGreaterThan(0);
    }

    for (const fact of EXPLORATION_FACTS) {
      const mappings = getAllMappingsForEntity(fact.id);
      expect(mappings.length, `Unmapped exploration fact: ${fact.id}`).toBeGreaterThan(0);
    }

    const envKeys = ['env_soil', 'env_water_bodies', 'env_rivers_streams', 'env_hills_valleys', 'env_flowers_pollinators', 'env_agricultural_crops'];
    for (const ek of envKeys) {
      expect(ENTITY_CURRICULUM_MAP[ek], `Missing environmental mapping: ${ek}`).toBeDefined();
      expect(getAllMappingsForEntity(ek).length).toBeGreaterThan(0);
    }
  });

  it('maps 100% of all 42 Question Bank questions to verified NCERT entries', () => {
    expect(QUESTION_BANK.length).toBe(42);
    for (const q of QUESTION_BANK) {
      const entry = resolveCurriculumForConcept(q.concept);
      expect(entry, `Unmapped question ${q.id} (concept: ${q.concept})`).not.toBeNull();
      expect(entry?.source.url.startsWith('https://ncert.nic.in/')).toBe(true);
    }
  });

  it('adapts NCERT curriculum resolution dynamically across student classes 6 through 12', () => {
    const grades: SupportedGrade[] = [6, 7, 8, 9, 10, 11, 12];

    // Solar Energy Lab spans Class 6 Curiosity -> Class 7/8 -> Class 10 Electricity/Geography -> Class 12 Semiconductors
    const solarG6 = resolveCurriculumForEntity('solar', 6);
    const solarG10 = resolveCurriculumForEntity('solar', 10);
    const solarG12 = resolveCurriculumForEntity('solar', 12);

    expect(solarG6?.grade).toBe(6);
    expect(solarG6?.chapterTitle).toBe("Nature's Treasures");
    expect(solarG10?.grade).toBe(10);
    expect(solarG12?.grade).toBe(12);
    expect(solarG12?.subject).toBe('Physics');

    // Runtime sprite IDs resolve cleanly to canonical curriculum entity keys
    expect(resolveEntityKeyFromRuntimeId('tree_neem_1', 'tree')).toBe('neem');
    expect(resolveEntityKeyFromRuntimeId('veh_bike_market', 'vehicle')).toBe('bicycle');
    expect(resolveEntityKeyFromRuntimeId('veh_auto_cruiser', 'vehicle')).toBe('auto_rickshaw');

    // Every supported grade 6..12 resolves non-null for core objects
    for (const g of grades) {
      expect(resolveCurriculumForEntity('neem', g)).not.toBeNull();
      expect(resolveCurriculumForEntity('well', g)).not.toBeNull();
      expect(resolveCurriculumForEntity('bicycle', g)).not.toBeNull();
    }
  });

  it('generates curriculum-grounded AI questions retaining exact verified NCERT metadata across question types', async () => {
    const mockAi = new MockAiProvider();
    const entry = resolveCurriculumForEntity('neem', 9)!;
    expect(entry).toBeDefined();

    const questionTypes = ['mcq', 'fill_blank', 'scenario', 'application', 'critical_thinking'] as const;

    for (const qt of questionTypes) {
      const prompt = buildCurriculumQuestionPrompt({
        curriculumId: entry.curriculumId,
        studentGrade: 9,
        ncertGrade: entry.grade,
        subject: entry.subject,
        textbook: entry.textbook,
        chapterNumber: entry.chapterNumber,
        chapterTitle: entry.chapterTitle,
        subtopic: entry.subtopic,
        learningObjective: entry.learningObjective,
        villageObject: 'Neem Tree',
        currentActivity: 'Exploring village trees',
        questionType: qt,
        difficulty: 2,
        lang: 'en',
      });

      expect(prompt).toContain(entry.curriculumId);
      expect(prompt).toContain(entry.chapterTitle);

      const generated = await mockAi.generateJson(prompt, GeneratedCurriculumQuestionSchema);
      expect(generated.curriculumId).toBe(entry.curriculumId);
      expect(generated.textbook).toBe(entry.textbook);
      expect(generated.chapterNumber).toBe(entry.chapterNumber);
      expect(generated.chapterTitle).toBe(entry.chapterTitle);
      expect(generated.questionType).toBe(qt);
    }

    // Offline fallback retains exact metadata too
    const offlineQ = buildOfflineCurriculumQuestion(entry, 7, 'Neem Tree', 'mcq');
    expect(offlineQ.curriculumId).toBe(entry.curriculumId);
    expect(offlineQ.isEnrichment).toBe(true); // Class 9 entry viewed by Class 7 student is marked enrichment!
  });
});
