import { Router, Request, Response, NextFunction } from 'express';
import { stemLensService } from './stem-lens.service';

export const stemLensRouter = Router();

/**
 * GET /api/v1/stem-lens/status
 * Returns module availability, integration readiness, and ownership metadata.
 */
stemLensRouter.get('/status', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const status = await stemLensService.getStatus();
    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/stem-lens/prompt
 * Returns the active system prompt template and file path so developer/user can inspect it.
 */
stemLensRouter.get('/prompt', (_req: Request, res: Response) => {
  const promptData = stemLensService.getPromptTemplate();
  res.status(200).json({
    success: true,
    data: promptData,
  });
});

/**
 * GET /api/v1/stem-lens/sessions
 * Returns all saved sessions for the user stored persistently in Supabase.
 */
stemLensRouter.get('/sessions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.query.userId as string) || 'student-robin';
    const sessions = await stemLensService.getSessions(userId);
    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/stem-lens/sessions
 * Create a new empty session in Supabase.
 */
stemLensRouter.post('/sessions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, userId } = req.body;
    const session = await stemLensService.createSession(title, userId);
    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/stem-lens/sessions/:id
 * Retrieve a specific session and all its messages from Supabase.
 */
stemLensRouter.get('/sessions/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const session = await stemLensService.getSessionById(id);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found.',
      });
    }
    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/v1/stem-lens/sessions/:id
 * Rename session in Supabase.
 */
stemLensRouter.patch('/sessions/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    if (!title || typeof title !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Title string is required.',
      });
    }
    const updated = await stemLensService.updateSessionTitle(id, title);
    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/v1/stem-lens/sessions/:id
 * Delete session and all messages from Supabase.
 */
stemLensRouter.delete('/sessions/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await stemLensService.deleteSession(id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/stem-lens/chat
 * Multimodal chat with xAI Grok (text prompt + optional uploaded base64 image or image generation).
 * Persists both user message and assistant reply in Supabase.
 */
stemLensRouter.post('/chat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, userId, message, imageBase64, imageMimeType, mode, conversationHistory } =
      req.body;
    if (!message && !imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'Either message or imageBase64 is required.',
      });
    }

    const response = await stemLensService.chat({
      sessionId,
      userId,
      message: message || '',
      imageBase64,
      imageMimeType,
      mode,
      conversationHistory,
    });

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err: any) {
    next(err);
  }
});

/**
 * POST /api/v1/stem-lens/generate-image
 * Dedicated visual generation endpoint using xAI grok-imagine-image.
 */
stemLensRouter.post('/generate-image', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Prompt string is required for image generation.',
      });
    }

    const response = await stemLensService.generateImage(prompt);
    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err: any) {
    next(err);
  }
});
