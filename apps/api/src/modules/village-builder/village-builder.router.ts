import { Router, Request, Response, NextFunction } from 'express';
import { villageBuilderService } from './village-builder.service';

export const villageBuilderRouter = Router();

/**
 * GET /api/v1/village-builder/status
 * Returns module availability, integration readiness, and ownership metadata.
 */
villageBuilderRouter.get('/status', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const status = await villageBuilderService.getStatus();
    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (err) {
    next(err);
  }
});
