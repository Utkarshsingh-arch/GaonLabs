import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { Express } from 'express';
import { prisma } from '../shared/database/prisma';
import { manifestLoader } from '../modules/experiment-studio/manifest-loader';
import { experimentCatalogueService } from '../modules/experiment-studio/experiment-catalogue.service';

describe('GaonLab Experiment Studio — Architecture, Science & API Tests', () => {
  let app: Express;

  beforeAll(async () => {
    app = createApp();

    // Ensure EXPERIMENT_STUDIO_ENABLED flag exists
    await prisma.featureFlag.upsert({
      where: { key: 'EXPERIMENT_STUDIO_ENABLED' },
      update: { isEnabledGlobally: true },
      create: {
        key: 'EXPERIMENT_STUDIO_ENABLED',
        description: 'Experiment Studio feature flag',
        isEnabledGlobally: true,
        enabledEnvironments: ['development', 'staging', 'production'],
        allowedCategories: ['MIDDLE', 'SECONDARY'],
        allowedOrganisations: [],
      },
    });

    await experimentCatalogueService.initialize();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('1. Manifest Schema & Scientific Content Validation', () => {
    it('Loads and validates all experiment manifests via Zod schema', async () => {
      const manifests = await manifestLoader.loadAllManifests();
      expect(manifests.length).toBeGreaterThanOrEqual(3);

      const chem = manifests.find((m) => m.code === 'EXP_CHEM_01');
      expect(chem).toBeDefined();
      expect(chem?.title).toBe('The Mystery of Changing Colours');
      expect(chem?.simulation.type).toBe('CHEMISTRY_ACID_BASE');
      expect(chem?.learningLifecycle.hints).toHaveLength(3);
      expect(chem?.learningLifecycle.mission.keyTerms.length).toBeGreaterThanOrEqual(3);

      const phys = manifests.find((m) => m.code === 'EXP_PHYS_01');
      expect(phys).toBeDefined();
      expect(phys?.title).toBe('Why Do Things Stop Moving?');
      expect(phys?.simulation.type).toBe('PHYSICS_MECHANICS_FRICTION');
      expect(phys?.learningLifecycle.observations.length).toBeGreaterThanOrEqual(3);

      const phys2 = manifests.find((m) => m.code === 'EXP_PHYS_02');
      expect(phys2).toBeDefined();
      expect(phys2?.simulation.type).toBe('PHYSICS_ROTATIONAL_DYNAMICS');
    });

    it('Verifies chemistry indicators follow authoritative scientific rulesets', async () => {
      const chem = manifestLoader.getManifestByCode('EXP_CHEM_01');
      expect(chem).toBeDefined();

      const materials = chem!.simulation.approvedMaterials;
      const lemon = materials.find((m) => m.id === 'LEMON_JUICE');
      expect(lemon?.properties.ph).toBe(2.2);
      expect(lemon?.properties.classification).toBe('ACID');

      const soap = materials.find((m) => m.id === 'SOAP_WATER');
      expect(soap?.properties.ph).toBe(9.5);
      expect(soap?.properties.classification).toBe('BASE');

      const turmeric = materials.find((m) => m.id === 'TURMERIC');
      expect(turmeric?.properties.baseColorHex).toBe('#DC2626'); // Red in base
      expect(turmeric?.properties.acidColorHex).toBe('#FBBF24'); // Yellow in acid

      const pheno = materials.find((m) => m.id === 'PHENOLPHTHALEIN');
      expect(pheno?.properties.acidColorHex).toBe('transparent');
      expect(pheno?.properties.baseColorHex).toBe('#EC4899'); // Pink in base
    });

    it('Verifies physics mechanics follows Coulomb friction and Newton laws', async () => {
      const phys = manifestLoader.getManifestByCode('EXP_PHYS_01');
      expect(phys).toBeDefined();

      const surfaces = phys!.simulation.approvedMaterials;
      const ice = surfaces.find((m) => m.id === 'ICE');
      const wood = surfaces.find((m) => m.id === 'WOOD_SMOOTH');
      const sandpaper = surfaces.find((m) => m.id === 'SANDPAPER');

      expect(ice?.properties.mu_k).toBe(0.05);
      expect(wood?.properties.mu_k).toBe(0.30);
      expect(sandpaper?.properties.mu_k).toBe(0.70);

      // Verify mathematical calculation:
      // F_friction = mu_k * m * g
      const m = 2.0; // kg
      const g = 9.8; // m/s^2
      const N = m * g; // 19.6 N
      const f_wood = wood!.properties.mu_k * N; // 0.30 * 19.6 = 5.88 N
      expect(Math.round(f_wood * 100) / 100).toBe(5.88);

      // Verify stopping distance d = v0^2 / (2 * mu_k * g)
      const v0 = 3.0; // m/s
      const d_ice = (v0 * v0) / (2 * ice!.properties.mu_k * g);
      const d_wood = (v0 * v0) / (2 * wood!.properties.mu_k * g);
      expect(d_ice).toBeGreaterThan(d_wood);
    });
  });

  describe('2. Experiment Studio REST API Endpoints', () => {
    let activeSessionId: string;

    it('GET /api/v1/experiments returns catalog of available experiments', async () => {
      const res = await request(app).get('/api/v1/experiments');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);

      const codes = res.body.data.map((e: any) => e.code);
      expect(codes).toContain('EXP_CHEM_01');
      expect(codes).toContain('EXP_PHYS_01');
    });

    it('GET /api/v1/experiments supports grade and board filtering', async () => {
      const res = await request(app).get('/api/v1/experiments?boardId=CBSE&grade=7');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const chem = res.body.data.find((e: any) => e.code === 'EXP_CHEM_01');
      expect(chem).toBeDefined();
    });

    it('GET /api/v1/experiments/:id/manifest returns full declarative manifest', async () => {
      const res = await request(app).get('/api/v1/experiments/EXP_CHEM_01/manifest');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.code).toBe('EXP_CHEM_01');
      expect(res.body.data.learningLifecycle.mission).toBeDefined();
      expect(res.body.data.learningLifecycle.prediction.options).toHaveLength(4);
    });

    it('POST /api/v1/experiments/:id/sessions initializes an interactive session', async () => {
      const res = await request(app)
        .post('/api/v1/experiments/EXP_CHEM_01/sessions')
        .send({
          boardId: 'CBSE',
          grade: 7,
          language: 'en',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.session).toBeDefined();
      expect(res.body.data.session.currentPhase).toBe('MISSION');
      expect(res.body.data.manifest.code).toBe('EXP_CHEM_01');

      activeSessionId = res.body.data.session.id;
    });

    it('GET /api/v1/experiments/sessions/:id retrieves active session', async () => {
      const res = await request(app).get(`/api/v1/experiments/sessions/${activeSessionId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.session.id).toBe(activeSessionId);
    });

    it('POST /api/v1/experiments/sessions/:id/events records events with idempotent deduplication', async () => {
      const clientEventId = `client_evt_${Date.now()}`;

      // First event ingestion
      const res1 = await request(app)
        .post(`/api/v1/experiments/sessions/${activeSessionId}/events`)
        .send({
          clientEventId,
          eventType: 'PREDICTION_SUBMITTED',
          phase: 'PREDICTION',
          payload: { optionId: 'opt-1', hypothesis: 'Turmeric turns red in basic soap' },
        });

      expect(res1.status).toBe(200);
      expect(res1.body.success).toBe(true);
      expect(res1.body.data.deduplicated).toBe(false);

      // Duplicate ingestion with same clientEventId
      const res2 = await request(app)
        .post(`/api/v1/experiments/sessions/${activeSessionId}/events`)
        .send({
          clientEventId,
          eventType: 'PREDICTION_SUBMITTED',
          phase: 'PREDICTION',
          payload: { optionId: 'opt-1', hypothesis: 'Turmeric turns red in basic soap' },
        });

      expect(res2.status).toBe(200);
      expect(res2.body.success).toBe(true);
      expect(res2.body.data.deduplicated).toBe(true);
    });

    it('POST /api/v1/experiments/sessions/:id/complete finalizes experiment session', async () => {
      const res = await request(app)
        .post(`/api/v1/experiments/sessions/${activeSessionId}/complete`)
        .send({
          reflectionNote: 'Understood that soap water is alkaline and turns turmeric red.',
          finalScore: 100,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.session.isCompleted).toBe(true);
      expect(res.body.data.session.currentPhase).toBe('COMPLETED');
    });
  });
});
