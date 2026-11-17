import { Router, Request, Response } from 'express';
import { experimentCatalogueService } from './experiment-catalogue.service';
import { experimentSessionService } from './experiment-session.service';
import { IngestExperimentEventDTO, ReconcileExperimentSessionDTO } from '@gaonlab/shared-types';
import { logger } from '../../shared/utils/logger';

export const experimentStudioRouter = Router();

/**
 * GET /api/v1/experiments
 * List available experiments with curriculum, grade, and simulation filters
 */
experimentStudioRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { boardId, grade, subjectId, simulationType, language } = req.query;

    const filters = {
      boardId: typeof boardId === 'string' ? boardId : undefined,
      grade: typeof grade === 'string' ? parseInt(grade, 10) : undefined,
      subjectId: typeof subjectId === 'string' ? subjectId : undefined,
      simulationType: typeof simulationType === 'string' ? simulationType : undefined,
      language: typeof language === 'string' ? language : undefined,
    };

    const experiments = await experimentCatalogueService.listExperiments(filters);

    return res.status(200).json({
      success: true,
      count: experiments.length,
      data: experiments,
    });
  } catch (error: any) {
    logger.error(`Failed to list experiments: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve experiments catalogue',
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/experiments/sessions/reconcile
 * Idempotently reconcile an offline-created experiment session
 * (Placed BEFORE /sessions/:id to prevent route clash)
 */
experimentStudioRouter.post('/sessions/reconcile', async (req: Request, res: Response) => {
  try {
    const dto: ReconcileExperimentSessionDTO = req.body;

    if (!dto.clientSessionId || !dto.experimentId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required clientSessionId or experimentId',
      });
    }

    const result = await experimentSessionService.reconcileSession(dto);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error(`Failed to reconcile experiment session: ${error.message}`);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to reconcile experiment session',
    });
  }
});

/**
 * GET /api/v1/experiments/sessions/:id
 * Retrieve session state and manifest (Placed BEFORE /:id to prevent route clash)
 */
experimentStudioRouter.get('/sessions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await experimentSessionService.getSession(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: `Session not found: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error(`Failed to get experiment session: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve experiment session',
    });
  }
});

/**
 * POST /api/v1/experiments/sessions/:id/events
 * Ingest lifecycle and interaction events idempotently
 */
experimentStudioRouter.post('/sessions/:id/events', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eventDto: IngestExperimentEventDTO = req.body;

    if (!eventDto.clientEventId || !eventDto.eventType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required clientEventId or eventType',
      });
    }

    const response = await experimentSessionService.ingestEvent(id, eventDto);

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    logger.error(`Failed to ingest experiment event: ${error.message}`);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to record experiment event',
      message: error.message,
    });
  }
});

/**
 * POST /api/v1/experiments/sessions/:id/complete
 * Complete session with final score and reflection note
 */
experimentStudioRouter.post('/sessions/:id/complete', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reflectionNote, finalScore } = req.body;

    const result = await experimentSessionService.completeSession(id, {
      reflectionNote,
      finalScore,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error(`Failed to complete experiment session: ${error.message}`);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to complete experiment session',
      message: error.message,
    });
  }
});

/**
 * GET /api/v1/experiments/:id/manifest
 * Retrieve the full declarative JSON manifest
 */
experimentStudioRouter.get('/:id/manifest', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const manifest = await experimentCatalogueService.getExperimentManifest(id);

    if (!manifest) {
      return res.status(404).json({
        success: false,
        error: `Experiment manifest not found: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: manifest,
    });
  } catch (error: any) {
    logger.error(`Failed to get experiment manifest: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve experiment manifest',
    });
  }
});

/**
 * POST /api/v1/experiments/:id/sessions
 * Start or resume an experiment session
 */
experimentStudioRouter.post('/:id/sessions', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { clientSessionId, learnerPersonId, boardId, grade, language } = req.body;

    const result = await experimentSessionService.startSession({
      experimentId: id,
      clientSessionId,
      learnerPersonId,
      boardId,
      grade,
      language,
    });

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error(`Failed to start experiment session: ${error.message}`);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: 'Failed to initialize experiment session',
      message: error.message,
    });
  }
});

/**
 * GET /api/v1/experiments/:id
 * Retrieve summary of an experiment
 */
experimentStudioRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const summary = await experimentCatalogueService.getExperimentSummary(id);

    if (!summary) {
      return res.status(404).json({
        success: false,
        error: `Experiment not found: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    logger.error(`Failed to get experiment summary: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve experiment details',
    });
  }
});
