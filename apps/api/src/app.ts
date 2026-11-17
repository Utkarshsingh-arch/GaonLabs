import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { SYSTEM_CONSTANTS } from './config/constants';
import { checkDatabaseConnection } from './shared/database/prisma';
import { notFoundHandler } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './shared/utils/logger';
import { curriculumRouter } from './modules/curriculum';
import { featureCatalogueRouter } from './modules/feature-catalogue';
import { stemLensRouter } from './modules/stem-lens';
import { villageBuilderRouter } from './modules/village-builder';
import { readerRouter } from './modules/reader';
import { topicRouter, videoStreamRouter } from './modules/topics/topic.router';

export function createApp(): Express {
  const app = express();

  // Security & Ingress
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
      credentials: true,
    })
  );
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Request tracing
  app.use((req: Request, _res: Response, next) => {
    logger.debug(`${req.method} ${req.url}`);
    next();
  });

  // ============================================================================
  // SYSTEM HEALTH & READINESS ENDPOINTS
  // ============================================================================

  /**
   * GET /health
   * Simple liveness check indicating the process is alive.
   */
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: SYSTEM_CONSTANTS.APP_NAME,
      version: SYSTEM_CONSTANTS.VERSION,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /ready
   * Readiness check verifying that PostgreSQL database is reachable.
   */
  app.get('/ready', async (_req: Request, res: Response) => {
    const dbStatus = await checkDatabaseConnection();

    if (!dbStatus.isHealthy) {
      return res.status(503).json({
        status: 'not_ready',
        service: SYSTEM_CONSTANTS.APP_NAME,
        database: {
          isHealthy: false,
          error: dbStatus.error,
          latencyMs: dbStatus.latencyMs,
        },
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      status: 'ready',
      service: SYSTEM_CONSTANTS.APP_NAME,
      version: SYSTEM_CONSTANTS.VERSION,
      database: {
        isHealthy: true,
        activeSource: dbStatus.activeSource,
        primaryHealthy: dbStatus.primaryHealthy,
        latencyMs: dbStatus.latencyMs,
      },
      timestamp: new Date().toISOString(),
    });
  });

  // Base API index
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      name: SYSTEM_CONSTANTS.APP_NAME,
      version: SYSTEM_CONSTANTS.VERSION,
      description: 'GaonLab Core Modular Monolith API',
      documentation: '/docs',
      health: '/health',
      ready: '/ready',
      curriculum: '/api/v1/curriculum',
    });
  });

  // Domain API Routes
  app.use('/api/v1/curriculum', curriculumRouter);
  app.use('/api/v1/features', featureCatalogueRouter);
  app.use('/api/v1/stem-lens', stemLensRouter);
  app.use('/api/v1/village-builder', villageBuilderRouter);
  app.use('/api/v1/reader', readerRouter);
  app.use('/api/v1/topics', topicRouter);
  app.use('/api/v1/videos', videoStreamRouter);

  // 404 & Global Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
