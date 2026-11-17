import { Router, Request, Response, NextFunction } from 'express';
import { featureCatalogueService } from './feature-catalogue.service';

export const featureCatalogueRouter = Router();

/**
 * GET /api/v1/features/catalogue
 * Returns the dynamic feature registry of all dashboard-accessible platform modules.
 */
featureCatalogueRouter.get('/catalogue', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const catalogue = await featureCatalogueService.getCatalogue();
    res.status(200).json({
      success: true,
      data: catalogue,
    });
  } catch (err) {
    next(err);
  }
});
