import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../shared/database/prisma';

describe('Smart Reader Backend Module & Copyright Enforcement', () => {
  const app = createApp();
  let sampleEditionId: string = 'ncert-g8-science';

  beforeAll(async () => {
    // Attempt to locate an existing seeded edition
    const edition = await prisma.textbookEdition.findFirst({
      include: { textbook: true, chapters: true },
    });
    if (edition) {
      sampleEditionId = edition.id;
    }
  });

  it('GET /api/v1/reader/books/:editionId returns textbook details and chapter sequence', async () => {
    const res = await request(app)
      .get(`/api/v1/reader/books/${sampleEditionId}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('title');
    expect(res.body.data).toHaveProperty('publisher');
    expect(res.body.data).toHaveProperty('copyrightNotice');
    expect(res.body.data).toHaveProperty('chapters');
    expect(Array.isArray(res.body.data.chapters)).toBe(true);
    expect(res.body.data.chapters.length).toBeGreaterThan(0);

    // Verify copyright protection notice is present
    expect(res.body.data.copyrightNotice).toContain('prohibits');
  });

  it('Strictly enforces DocumentAccessMode boundaries between authorized companion and official external', async () => {
    const res = await request(app)
      .get(`/api/v1/reader/books/${sampleEditionId}`)
      .expect(200);

    const chapters = res.body.data.chapters;
    const authorizedChapters = chapters.filter((c: any) => c.accessMode === 'IN_APP_AUTHORIZED');
    const externalChapters = chapters.filter((c: any) => c.accessMode === 'OFFICIAL_EXTERNAL_ONLY');

    // Either chapters have authorized companions or they point to official external sources
    expect(authorizedChapters.length + externalChapters.length).toBe(chapters.length);

    if (authorizedChapters.length > 0) {
      expect(authorizedChapters[0]).toHaveProperty('documentId');
      expect(authorizedChapters[0].documentId).toBe('doc-forces-and-friction-cl8');
    }
  });

  it('GET /api/v1/reader/documents/:documentId returns metadata for authorized original learning guide', async () => {
    const res = await request(app)
      .get('/api/v1/reader/documents/doc-forces-and-friction-cl8')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.documentId).toBe('doc-forces-and-friction-cl8');
    expect(res.body.data.title).toBe('Forces and Friction — A Visual Learning Guide');
    expect(res.body.data.accessMode).toBe('IN_APP_AUTHORIZED');
    expect(res.body.data.url).toBe('/documents/forces-and-friction-guide.pdf');
    expect(res.body.data.isCompanionGuide).toBe(true);
    expect(res.body.data.license).toContain('Creative Commons');
  });

  it('GET /api/v1/reader/documents/:documentId returns 404 for unauthorized document request', async () => {
    const res = await request(app)
      .get('/api/v1/reader/documents/unauthorized-ncert-raw-pdf')
      .expect(404);

    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('not authorized');
  });

  it('GET /api/v1/reader/chapters/:chapterId/explanations returns STEM visual explanations', async () => {
    const res = await request(app)
      .get('/api/v1/reader/chapters/ch-friction-sample/explanations')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);

    const firstExp = res.body.data[0];
    expect(firstExp).toHaveProperty('title');
    expect(firstExp).toHaveProperty('shortExplanation');
    expect(firstExp).toHaveProperty('visualType');
    expect(firstExp).toHaveProperty('realWorldExample');
  });

  it('POST /api/v1/reader/explain matches selected passage text to contextual visual explanation', async () => {
    const res = await request(app)
      .post('/api/v1/reader/explain')
      .send({
        selectedText: 'The football stops because of an opposing contact force exerted by rough grass and soil.',
        grade: 8,
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toContain('Newton');
    expect(res.body.data.shortExplanation).toContain('decelerates');
    expect(res.body.data.visualData.animationType).toBe('BLOCK_PULL');
    expect(res.body.data.realWorldExample).toContain('bicycle');
  });

  it('POST /api/v1/reader/explain matches surface lubrication questions accurately', async () => {
    const res = await request(app)
      .post('/api/v1/reader/explain')
      .send({
        selectedText: 'Why is it easier to move objects when lubricants like oil or grease are applied?',
        grade: 8,
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toContain('Lubrication');
    expect(res.body.data.visualData.animationType).toBe('FRICTION_SURFACES');
    expect(res.body.data.realWorldExample).toContain('carrom');
  });
});
