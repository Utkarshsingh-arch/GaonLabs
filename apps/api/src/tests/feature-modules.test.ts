import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../shared/database/prisma';
import { Express } from 'express';

describe('Feature Modules & Integration Registry (Stage 3 Expansion)', () => {
  let app: Express;

  beforeAll(async () => {
    app = createApp();

    // Ensure feature flags are seeded
    await prisma.featureFlag.upsert({
      where: { key: 'STEM_LENS_ENABLED' },
      update: { isEnabledGlobally: true },
      create: {
        key: 'STEM_LENS_ENABLED',
        description: 'STEM Lens feature flag (Robin)',
        isEnabledGlobally: true,
        enabledEnvironments: ['development', 'staging', 'production'],
        allowedCategories: ['MIDDLE', 'SECONDARY'],
        allowedOrganisations: [],
      },
    });

    await prisma.featureFlag.upsert({
      where: { key: 'VILLAGE_BUILDER_ENABLED' },
      update: { isEnabledGlobally: true },
      create: {
        key: 'VILLAGE_BUILDER_ENABLED',
        description: 'Village Builder feature flag (Prashanth)',
        isEnabledGlobally: true,
        enabledEnvironments: ['development', 'staging', 'production'],
        allowedCategories: ['MIDDLE', 'SECONDARY'],
        allowedOrganisations: [],
      },
    });

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
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('GET /api/v1/features/catalogue returns both registered feature modules', async () => {
    const res = await request(app).get('/api/v1/features/catalogue');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.features).toHaveLength(3);

    const featureIds = res.body.data.features.map((f: any) => f.featureId);
    expect(featureIds).toContain('STEM_LENS');
    expect(featureIds).toContain('VILLAGE_BUILDER');
    expect(featureIds).toContain('EXPERIMENT_STUDIO');

    const lens = res.body.data.features.find((f: any) => f.featureId === 'STEM_LENS');
    expect(lens.name).toBe('STEM Lens');
    expect(lens.owner).toBe('Robin');
    expect(lens.frontendRoute).toBe('/app/stem-lens');
    expect(lens.integrationReadiness.contractsDefined).toBe(true);
    expect(lens.integrationReadiness.businessLogicImplemented).toBe(false);

    const vb = res.body.data.features.find((f: any) => f.featureId === 'VILLAGE_BUILDER');
    expect(vb.name).toBe('STEM Village Builder');
    expect(vb.owner).toBe('Prashanth');
    expect(vb.frontendRoute).toBe('/app/village-builder');
    expect(vb.integrationReadiness.contractsDefined).toBe(true);
    expect(vb.integrationReadiness.businessLogicImplemented).toBe(false);
  });

  it('GET /api/v1/stem-lens/status returns Robin module status and contracts', async () => {
    const res = await request(app).get('/api/v1/stem-lens/status');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.featureId).toBe('STEM_LENS');
    expect(res.body.data.owner).toBe('Robin');
    expect(res.body.data.frontendRoute).toBe('/app/stem-lens');
    expect(res.body.data.status).toBe('INTEGRATION_PENDING');
    expect(res.body.data.supportedIdentifiers.learnerId).toBe(true);
    expect(res.body.data.supportedIdentifiers.conceptId).toBe(true);
    expect(res.body.data.supportedIdentifiers.activityId).toBe(true);
    expect(res.body.data.note).toContain('Robin');
  });

  it('GET /api/v1/village-builder/status returns Prashanth module status and contracts', async () => {
    const res = await request(app).get('/api/v1/village-builder/status');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.featureId).toBe('VILLAGE_BUILDER');
    expect(res.body.data.owner).toBe('Prashanth');
    expect(res.body.data.frontendRoute).toBe('/app/village-builder');
    expect(res.body.data.status).toBe('INTEGRATION_PENDING');
    expect(res.body.data.geographicReadiness.districtContextSupported).toBe(true);
    expect(res.body.data.note).toContain('Prashanth');
  });

  it('Respects feature flag gating when flag is globally disabled', async () => {
    // Temporarily disable STEM Lens
    await prisma.featureFlag.update({
      where: { key: 'STEM_LENS_ENABLED' },
      data: { isEnabledGlobally: false },
    });

    const res = await request(app).get('/api/v1/features/catalogue');
    expect(res.status).toBe(200);

    const lens = res.body.data.features.find((f: any) => f.featureId === 'STEM_LENS');
    expect(lens.status).toBe('DISABLED');

    // Restore feature flag
    await prisma.featureFlag.update({
      where: { key: 'STEM_LENS_ENABLED' },
      data: { isEnabledGlobally: true },
    });
  });
});
