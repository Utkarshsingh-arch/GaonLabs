import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { topicService } from './topic.service';

export const topicRouter = Router();

/**
 * GET /api/v1/topics
 * Returns filtered list of topics from curriculum catalogue.
 */
topicRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { boardId, grade, subjectId, medium, academicYear } = req.query;

    const parsedGrade = grade ? parseInt(grade as string, 10) : undefined;
    const topics = await topicService.listTopics({
      boardId: boardId as string,
      grade: parsedGrade,
      subjectId: subjectId as string,
      medium: medium as string,
      academicYear: academicYear as string,
    });

    res.json({
      success: true,
      data: topics,
      count: topics.length,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/topics/match
 * Smart Reader Explain action: matches selected text / chapter / grade to topic.
 */
topicRouter.post('/match', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { selectedText, chapterId, documentId, grade, medium } = req.body;
    if (!selectedText) {
      res.status(400).json({ success: false, error: 'selectedText is required' });
      return;
    }

    const match = await topicService.matchTopicByTextOrChapter({
      selectedText,
      chapterId,
      documentId,
      grade: grade ? Number(grade) : undefined,
      medium: medium as string,
    });

    if (!match) {
      res.status(404).json({
        success: false,
        error: 'No verified topic or video explanation found for this text selection.',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        topicId: match.topic.topicId,
        topicTitle: match.topic.title,
        matchedConcept: match.lesson.simpleExplanation,
        grade: match.topic.grade,
        subjectName: match.topic.subjectName,
        hasLesson: match.topic.hasLesson,
        hasVideo: match.topic.hasVideo,
        videoUrl: match.video?.streamUrl,
        matchScore: 95,
        topic: match.topic,
        lesson: match.lesson,
        video: match.video,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/topics/:topicId
 * Returns complete topic detail.
 */
topicRouter.get('/:topicId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topicId } = req.params;
    const topic = await topicService.getTopicById(topicId);

    if (!topic) {
      res.status(404).json({ success: false, error: 'Topic not found in catalogue' });
      return;
    }

    res.json({
      success: true,
      data: topic,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/topics/:topicId/lesson
 * Returns in-app lesson reading experience.
 */
topicRouter.get('/:topicId/lesson', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topicId } = req.params;
    const { lang } = req.query;
    const lesson = await topicService.getTopicLesson(topicId, lang as string);

    if (!lesson) {
      res.status(404).json({ success: false, error: 'In-app lesson not available for this topic' });
      return;
    }

    res.json({
      success: true,
      data: lesson,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/topics/:topicId/video
 * Returns video metadata.
 */
topicRouter.get('/:topicId/video', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topicId } = req.params;
    const { lang } = req.query;
    const video = await topicService.getTopicVideo(topicId, lang as string);

    if (!video) {
      res.status(404).json({
        success: false,
        error: 'No video asset has been generated for this topic yet.',
      });
      return;
    }

    res.json({
      success: true,
      data: video,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/topics/:topicId/resources
 * Returns official curriculum resources and links.
 */
topicRouter.get('/:topicId/resources', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topicId } = req.params;
    const resources = await topicService.getTopicResources(topicId);

    if (!resources) {
      res.status(404).json({
        success: false,
        error: 'Official resources not catalogued for this topic',
      });
      return;
    }

    res.json({
      success: true,
      data: resources,
    });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// Video Asset Streaming & Caption Serving
// =========================================================================

export const videoStreamRouter = Router();

// Helper functions to resolve media paths regardless of process.cwd()
function findVideoFile(targetId: string): string | null {
  const candidates = [
    path.resolve(process.cwd(), 'public/videos', `${targetId}.mp4`),
    path.resolve(process.cwd(), '../../public/videos', `${targetId}.mp4`),
    path.resolve(process.cwd(), '../web/public/videos', `${targetId}.mp4`),
    path.resolve(process.cwd(), 'apps/web/public/videos', `${targetId}.mp4`),
    path.resolve(__dirname, '../../../../../public/videos', `${targetId}.mp4`),
    path.resolve(__dirname, '../../../../web/public/videos', `${targetId}.mp4`),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function findCaptionFile(targetName: string): string | null {
  const candidates = [
    path.resolve(process.cwd(), 'public/videos/captions', targetName),
    path.resolve(process.cwd(), '../../public/videos/captions', targetName),
    path.resolve(process.cwd(), '../web/public/videos/captions', targetName),
    path.resolve(process.cwd(), 'apps/web/public/videos/captions', targetName),
    path.resolve(__dirname, '../../../../../public/videos/captions', targetName),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

const TOPIC_TO_VIDEO_MAP: Record<string, string> = {
  'topic-shapes-class3': 'video-shapes-class3-en',
  'topic-forces-friction-cl8': 'video-forces-friction-cl8-en',
  'topic-rotational-motion-cl11': 'video-rotational-motion-cl11-en',
  'topic-ktbs-heat-cl7-kn': 'video-heat-class7-kn',
};

/**
 * GET /api/v1/videos/stream/:videoId
 * Streams MP4 video with HTTP 206 Partial Content support for seeking.
 */
videoStreamRouter.get('/stream/:videoId', (req: Request, res: Response) => {
  const { videoId } = req.params;
  const targetId = TOPIC_TO_VIDEO_MAP[videoId] || videoId;
  const videoFile = findVideoFile(targetId);

  if (!videoFile) {
    res.status(404).json({
      success: false,
      error: `Video file ${targetId}.mp4 not found on storage server.`,
    });
    return;
  }

  streamFile(videoFile, req, res);
});

function streamFile(filePath: string, req: Request, res: Response) {
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
}

/**
 * GET /api/v1/videos/captions/:filename
 * Serves WebVTT subtitle files.
 */
videoStreamRouter.get('/captions/:filename', (req: Request, res: Response) => {
  const { filename } = req.params;
  const cleanName = filename.replace(/\.vtt$/, '');
  const resolved = TOPIC_TO_VIDEO_MAP[cleanName] || cleanName;
  const targetName = resolved.endsWith('.vtt') ? resolved : `${resolved}.vtt`;

  const captionFile = findCaptionFile(targetName);

  if (!captionFile) {
    res.status(404).send('Caption file not found');
    return;
  }

  res.setHeader('Content-Type', 'text/vtt; charset=utf-8');
  fs.createReadStream(captionFile).pipe(res);
});

/**
 * GET /api/v1/videos/transcripts/:filename
 * Serves plain text transcript files.
 */
videoStreamRouter.get('/transcripts/:filename', (req: Request, res: Response) => {
  const { filename } = req.params;
  let transcriptFile = path.join(TRANSCRIPTS_STORAGE_DIR, filename);

  if (!fs.existsSync(transcriptFile)) {
    transcriptFile = path.resolve('apps/web/public/videos/transcripts', filename);
  }

  if (!fs.existsSync(transcriptFile)) {
    res.status(404).send('Transcript file not found');
    return;
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  fs.createReadStream(transcriptFile).pipe(res);
});
