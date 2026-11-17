import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { Express } from 'express';
import { prisma } from '../shared/database/prisma';
import { manifestLoader } from '../modules/experiment-studio/manifest-loader';
import { experimentCatalogueService } from '../modules/experiment-studio/experiment-catalogue.service';

describe('GaonLab Experiment Studio — Offline Session Reconciliation & Reliable Sync', () => {
  let app: Express;
  let testLearnerAId: string;
  let testLearnerBId: string;

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

    await manifestLoader.loadAllManifests();
    await experimentCatalogueService.initialize();

    // Create two test learners for multi-learner isolation testing
    const accA = await prisma.account.create({
      data: {
        loginIdentifier: `learner.a.${Date.now()}@gaonlab.internal`,
        email: `learner.a.${Date.now()}@gaonlab.internal`,
        status: 'ACTIVATED',
        accountType: 'LEARNER',
      },
    });
    const personA = await prisma.person.create({
      data: {
        accountId: accA.id,
        displayName: 'Learner A',
        preferredLanguage: 'en',
      },
    });
    testLearnerAId = personA.id;

    const accB = await prisma.account.create({
      data: {
        loginIdentifier: `learner.b.${Date.now()}@gaonlab.internal`,
        email: `learner.b.${Date.now()}@gaonlab.internal`,
        status: 'ACTIVATED',
        accountType: 'LEARNER',
      },
    });
    const personB = await prisma.person.create({
      data: {
        accountId: accB.id,
        displayName: 'Learner B',
        preferredLanguage: 'kn',
      },
    });
    testLearnerBId = personB.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('1. Offline Session Reconciliation API', () => {
    const offlineSessionId = `client_uuid_${Date.now()}_abc`;

    it('creates a new server session from an offline client session snapshot', async () => {
      const res = await request(app)
        .post('/api/v1/experiments/sessions/reconcile')
        .send({
          clientSessionId: offlineSessionId,
          experimentId: 'EXP_CHEM_01',
          learnerPersonId: testLearnerAId,
          boardId: 'CBSE',
          grade: 8,
          language: 'en',
          currentPhase: 'EXPERIMENT',
          predictionData: { optionId: 'opt_lemon_red' },
          observationData: [
            { apparatusId: 'DROPPER_01', materialId: 'LEMON_JUICE', indicatorId: 'TURMERIC', observedColorHex: '#FBBF24' },
          ],
          responsesData: {},
          hintsUsedCount: 1,
          startedAt: new Date(Date.now() - 3600000).toISOString(),
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.session.clientSessionId).toBe(offlineSessionId);
      expect(res.body.data.session.currentPhase).toBe('EXPERIMENT');
      expect(res.body.data.recordedObservations).toHaveLength(1);
      expect(res.body.data.manifest.code).toBe('EXP_CHEM_01');

      // Verify in DB directly
      const dbSession = await prisma.experimentSession.findUnique({
        where: { clientSessionId: offlineSessionId },
      });
      expect(dbSession).toBeDefined();
      expect(dbSession?.learnerPersonId).toBe(testLearnerAId);
    });

    it('idempotently updates existing session without creating duplicate rows', async () => {
      const res = await request(app)
        .post('/api/v1/experiments/sessions/reconcile')
        .send({
          clientSessionId: offlineSessionId,
          experimentId: 'EXP_CHEM_01',
          learnerPersonId: testLearnerAId,
          currentPhase: 'QUESTIONING',
          observationData: [
            { apparatusId: 'DROPPER_01', materialId: 'LEMON_JUICE', indicatorId: 'TURMERIC', observedColorHex: '#FBBF24' },
            { apparatusId: 'DROPPER_02', materialId: 'SOAP_WATER', indicatorId: 'TURMERIC', observedColorHex: '#DC2626' },
          ],
          responsesData: {
            q1: { selectedIndex: 1, isCorrect: true },
          },
          hintsUsedCount: 2,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.session.currentPhase).toBe('QUESTIONING');
      expect(res.body.data.recordedObservations).toHaveLength(2);

      // Verify in DB that only 1 record exists with this clientSessionId
      const matches = await prisma.experimentSession.findMany({
        where: { clientSessionId: offlineSessionId },
      });
      expect(matches).toHaveLength(1);
    });
  });

  describe('2. Dual-Key Resolution for Events & Completion', () => {
    const offlineSessionId = `client_uuid_dual_${Date.now()}`;
    const clientEvent1 = `evt_dedup_${Date.now()}_1`;
    const clientEvent2 = `evt_dedup_${Date.now()}_2`;

    beforeAll(async () => {
      // Reconcile session first
      await request(app)
        .post('/api/v1/experiments/sessions/reconcile')
        .send({
          clientSessionId: offlineSessionId,
          experimentId: 'EXP_PHYS_01',
          learnerPersonId: testLearnerAId,
          currentPhase: 'MISSION',
        });
    });

    it('ingests events using clientSessionId as the session identifier', async () => {
      const res = await request(app)
        .post(`/api/v1/experiments/sessions/${offlineSessionId}/events`)
        .send({
          clientEventId: clientEvent1,
          eventType: 'PREDICTION_SUBMITTED',
          phase: 'PREDICTION',
          payload: { optionId: 'opt_rough_more' },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.deduplicated).toBe(false);
      expect(res.body.data.currentPhase).toBe('PREDICTION');
    });

    it('idempotently deduplicates repeated event ingestion with the same clientEventId', async () => {
      const res = await request(app)
        .post(`/api/v1/experiments/sessions/${offlineSessionId}/events`)
        .send({
          clientEventId: clientEvent1,
          eventType: 'PREDICTION_SUBMITTED',
          phase: 'PREDICTION',
          payload: { optionId: 'opt_rough_more' },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.deduplicated).toBe(true);

      // Verify in DB that only one event row exists
      const dbEvents = await prisma.experimentEvent.findMany({
        where: { clientEventId: clientEvent1 },
      });
      expect(dbEvents).toHaveLength(1);
    });

    it('resolves session retrieval using clientSessionId', async () => {
      const res = await request(app).get(`/api/v1/experiments/sessions/${offlineSessionId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.session.clientSessionId).toBe(offlineSessionId);
      expect(res.body.data.session.currentPhase).toBe('PREDICTION');
    });

    it('completes session using clientSessionId', async () => {
      const res = await request(app)
        .post(`/api/v1/experiments/sessions/${offlineSessionId}/complete`)
        .send({
          reflectionNote: 'Friction opposes relative motion and depends on surface roughness.',
          finalScore: 100,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.session.isCompleted).toBe(true);
      expect(res.body.data.session.currentPhase).toBe('COMPLETED');
    });
  });

  describe('3. Multi-Learner Isolation and Validation Boundaries', () => {
    it('rejects cross-learner session reconciliation with HTTP 403', async () => {
      const sharedClientSessionId = `client_iso_${Date.now()}`;

      // Learner A reconciles first
      const resA = await request(app)
        .post('/api/v1/experiments/sessions/reconcile')
        .send({
          clientSessionId: sharedClientSessionId,
          experimentId: 'EXP_CHEM_01',
          learnerPersonId: testLearnerAId,
        });
      expect(resA.status).toBe(200);

      // Learner B attempts to reconcile the same clientSessionId
      const resB = await request(app)
        .post('/api/v1/experiments/sessions/reconcile')
        .send({
          clientSessionId: sharedClientSessionId,
          experimentId: 'EXP_CHEM_01',
          learnerPersonId: testLearnerBId,
        });

      expect(resB.status).toBe(403);
      expect(resB.body.success).toBe(false);
      expect(resB.body.error).toContain('mismatch');
    });

    it('validates required fields on reconciliation', async () => {
      const res = await request(app)
        .post('/api/v1/experiments/sessions/reconcile')
        .send({
          experimentId: 'EXP_CHEM_01',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('clientSessionId');
    });

    it('returns 404 when ingesting events for a non-existent session', async () => {
      const res = await request(app)
        .post('/api/v1/experiments/sessions/non_existent_session_xyz/events')
        .send({
          clientEventId: `evt_404_${Date.now()}`,
          eventType: 'PREDICTION_SUBMITTED',
          phase: 'PREDICTION',
          payload: { optionId: 'opt1' },
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('not found');
    });

    it('returns 404 for non-existent experiment reference', async () => {
      const res = await request(app)
        .post('/api/v1/experiments/sessions/reconcile')
        .send({
          clientSessionId: `client_404_${Date.now()}`,
          experimentId: 'EXP_NON_EXISTENT_99',
        });

      expect(res.status).toBe(404);
    });
  });
});
