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
