import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

describe('Explore STEM & Topics Module Integration Tests', () => {
  const app = createApp();

  it('GET /api/v1/topics returns list of topics across STEM subjects', async () => {
    const res = await request(app).get('/api/v1/topics').expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);

    const first = res.body.data[0];
    expect(first).toHaveProperty('topicId');
    expect(first).toHaveProperty('title');
    expect(first).toHaveProperty('grade');
    expect(first).toHaveProperty('subjectId');
    expect(first).toHaveProperty('stemPillar');
    expect(first).toHaveProperty('accessMode');
  });

  it('GET /api/v1/topics filters accurately by grade', async () => {
    const res = await request(app).get('/api/v1/topics?grade=8').expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach((topic: any) => {
      expect(topic.grade).toBe(8);
    });
  });

  it('GET /api/v1/topics filters by board and grade', async () => {
    const res = await request(app)
      .get('/api/v1/topics?boardId=CBSE&grade=3')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].topicId).toBe('topic-shapes-class3');
    expect(res.body.data[0].boardId).toBe('CBSE');
  });

  it('GET /api/v1/topics/:topicId returns complete topic detail', async () => {
    const res = await request(app)
      .get('/api/v1/topics/topic-forces-friction-cl8')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.topicId).toBe('topic-forces-friction-cl8');
    expect(res.body.data.title).toContain('Forces and Friction');
    expect(res.body.data.grade).toBe(8);
    expect(res.body.data.hasLesson).toBe(true);
    expect(res.body.data.hasVideo).toBe(true);
    expect(res.body.data.hasOfficialResources).toBe(true);
  });

  it('GET /api/v1/topics/:topicId returns 404 for unknown topic', async () => {
    const res = await request(app)
      .get('/api/v1/topics/topic-unknown-999')
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/topics/:topicId/lesson returns original structured lesson content', async () => {
    const res = await request(app)
      .get('/api/v1/topics/topic-forces-friction-cl8/lesson')
      .expect(200);

    expect(res.body.success).toBe(true);
    const lesson = res.body.data;
    expect(lesson.topicId).toBe('topic-forces-friction-cl8');
    expect(lesson.topicIntroduction).toBeDefined();
    expect(lesson.simpleExplanation).toBeDefined();
    expect(Array.isArray(lesson.scientificPrinciples)).toBe(true);
    expect(lesson.scientificPrinciples.length).toBeGreaterThan(0);
    expect(Array.isArray(lesson.examples)).toBe(true);
    expect(Array.isArray(lesson.realWorldApplications)).toBe(true);
    expect(Array.isArray(lesson.importantTakeaways)).toBe(true);
    expect(Array.isArray(lesson.glossary)).toBe(true);
  });

  it('GET /api/v1/topics/:topicId/video returns video metadata and stream URL', async () => {
    const res = await request(app)
      .get('/api/v1/topics/topic-rotational-motion-cl11/video')
      .expect(200);

    expect(res.body.success).toBe(true);
    const video = res.body.data;
    expect(video.topicId).toBe('topic-rotational-motion-cl11');
    expect(video.streamUrl).toBeDefined();
    expect(video.durationSeconds).toBeGreaterThan(0);
    expect(video.resolution).toBe('1280x720');
    expect(video.hasAudio).toBe(true);
  });

  it('GET /api/v1/topics/:topicId/resources returns official curriculum textbook linkages', async () => {
    const res = await request(app)
      .get('/api/v1/topics/topic-forces-friction-cl8/resources')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const ref = res.body.data[0];
    expect(ref.textbookTitle).toBeDefined();
    expect(ref.officialSourceUrl).toBeDefined();
    expect(ref.publisher).toBeDefined();
    expect(ref.licenceNotice).toBeDefined();
    expect(ref.disclaimer).toBeDefined();
  });

  it('POST /api/v1/topics/match connects selected reader text to relevant topic and video', async () => {
    const res = await request(app)
      .post('/api/v1/topics/match')
      .send({
        selectedText: 'Friction opposes the relative motion between two surfaces in contact.',
        grade: 8,
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.topicId).toBe('topic-forces-friction-cl8');
    expect(res.body.data.hasVideo).toBe(true);
    expect(res.body.data.matchScore).toBeGreaterThan(0);
  });

  it('POST /api/v1/topics/match returns 404 when selection has no matching STEM topic', async () => {
    const res = await request(app)
      .post('/api/v1/topics/match')
      .send({
        selectedText: 'Once upon a time in a faraway mystical kingdom with flying dragons.',
        grade: 8,
      })
      .expect(404);

    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/videos/stream/:topicId streams video with HTTP 206 Partial Content or 200', async () => {
    const res = await request(app)
      .get('/api/v1/videos/stream/topic-forces-friction-cl8')
      .set('Range', 'bytes=0-1024');

    // Either 206 (partial) or 200 (if handled as complete)
    expect([200, 206]).toContain(res.status);
    expect(res.headers['content-type']).toContain('video/mp4');
    expect(res.headers['accept-ranges']).toBe('bytes');
  });

  it('GET /api/v1/videos/captions/:topicId serves valid WebVTT closed captions', async () => {
    const res = await request(app)
      .get('/api/v1/videos/captions/topic-forces-friction-cl8')
      .expect(200);

    expect(res.headers['content-type']).toContain('text/vtt');
    expect(res.text).toContain('WEBVTT');
    expect(res.text).toContain('-->');
  });

  // ---------------------------------------------------------------------------
  // Karnataka State Board (KTBS) & Kannada Medium Tests
  // ---------------------------------------------------------------------------

  it('GET /api/v1/topics returns KTBS Class 7 Kannada topics', async () => {
    const res = await request(app)
      .get('/api/v1/topics?boardId=KARNATAKA_STATE_BOARD&grade=7&medium=kn')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(4);

    const heatTopic = res.body.data.find((t: any) => t.topicId === 'topic-ktbs-heat-cl7-kn');
    expect(heatTopic).toBeDefined();
    expect(heatTopic.title).toContain('ಉಷ್ಣ');
    expect(heatTopic.medium).toBe('kn');
    expect(heatTopic.hasVideo).toBe(true);
    expect(heatTopic.videoMeta.videoId).toBe('video-heat-class7-kn');

    const integersTopic = res.body.data.find((t: any) => t.topicId === 'topic-ktbs-integers-cl7-kn');
    expect(integersTopic).toBeDefined();
    expect(integersTopic.title).toContain('ಪೂರ್ಣಾಂಕಗಳು');
    expect(integersTopic.medium).toBe('kn');
    expect(integersTopic.hasVideo).toBe(false);
  });

  it('GET /api/v1/topics/:topicId/lesson returns authentic Kannada lesson content', async () => {
    const res = await request(app)
      .get('/api/v1/topics/topic-ktbs-heat-cl7-kn/lesson')
      .expect(200);

    expect(res.body.success).toBe(true);
    const lesson = res.body.data;
    expect(lesson.language).toBe('kn');
    expect(lesson.topicIntroduction).toContain('ಉಷ್ಣ');
    expect(lesson.simpleExplanation).toContain('ತಾಪಮಾನ');
    expect(lesson.scientificPrinciples.length).toBeGreaterThanOrEqual(3);
    expect(lesson.realWorldApplications.length).toBeGreaterThan(0);
    expect(lesson.glossary.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/videos/stream/video-heat-class7-kn streams generated Kannada MP4 video', async () => {
    const res = await request(app)
      .get('/api/v1/videos/stream/video-heat-class7-kn')
      .set('Range', 'bytes=0-1024');

    expect([200, 206]).toContain(res.status);
    expect(res.headers['content-type']).toContain('video/mp4');
    expect(res.headers['accept-ranges']).toBe('bytes');
  });

  it('GET /api/v1/videos/captions/video-heat-class7-kn.vtt serves Kannada WebVTT subtitles', async () => {
    const res = await request(app)
      .get('/api/v1/videos/captions/video-heat-class7-kn.vtt')
      .expect(200);

    expect(res.headers['content-type']).toContain('text/vtt');
    expect(res.text).toContain('WEBVTT');
    expect(res.text).toContain('-->');
    expect(res.text).toMatch(/[\u0C80-\u0CFF]/); // Contains Kannada Unicode characters
  });

  it('GET /api/v1/topics/:topicId/video respects language parameter and avoids silent fallback', async () => {
    // Topic with no video returns 404
    await request(app)
      .get('/api/v1/topics/topic-ktbs-integers-cl7-kn/video?lang=kn')
      .expect(404);

    // English video does not silently return when Kannada is explicitly requested
    await request(app)
      .get('/api/v1/topics/topic-shapes-class3/video?lang=kn')
      .expect(404);

    // Kannada video returns when requested
    const res = await request(app)
      .get('/api/v1/topics/topic-ktbs-heat-cl7-kn/video?lang=kn')
      .expect(200);
    expect(res.body.data.language).toBe('kn');
    expect(res.body.data.videoId).toBe('video-heat-class7-kn');
  });

  it('POST /api/v1/topics/match identifies Kannada text selection for Smart Reader', async () => {
    const res = await request(app)
      .post('/api/v1/topics/match')
      .send({
        selectedText: 'ಉಷ್ಣವು ಯಾವಾಗಲೂ ಹೆಚ್ಚು ತಾಪಮಾನವಿರುವ ವಸ್ತುವಿನಿಂದ ಕಡಿಮೆ ತಾಪಮಾನವಿರುವ ವಸ್ತುವಿಗೆ ಹರಿಯುತ್ತದೆ.',
        grade: 7,
        medium: 'kn',
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.topicId).toBe('topic-ktbs-heat-cl7-kn');
    expect(res.body.data.hasVideo).toBe(true);
    expect(res.body.data.videoUrl).toBe('/api/v1/videos/stream/video-heat-class7-kn');
  });
});
