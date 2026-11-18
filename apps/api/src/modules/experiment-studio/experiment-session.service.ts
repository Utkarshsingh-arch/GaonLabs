import {
  ExperimentLifecyclePhase,
  ExperimentManifest,
  ExperimentSessionDTO,
  ExperimentSessionResult,
  IngestExperimentEventDTO,
  ReconcileExperimentSessionDTO,
} from '@gaonlab/shared-types';
import { prisma } from '../../shared/database/prisma';
import { manifestLoader } from './manifest-loader';
import { logger } from '../../shared/utils/logger';

export class ExperimentSessionService {
  /**
   * Helper to resolve or fallback a valid learnerPersonId for DB FK constraints
   */
  private async resolveLearnerPersonId(candidateId?: string): Promise<string> {
    if (candidateId) {
      const existing = await prisma.person.findUnique({
        where: { id: candidateId },
      });
      if (existing) return existing.id;
    }

    // Look for any existing Person record
    const anyPerson = await prisma.person.findFirst();
    if (anyPerson) {
      return anyPerson.id;
    }

    // Create a demo student Person record if database has none
    const account = await prisma.account.create({
      data: {
        loginIdentifier: `demo.student.${Date.now()}@gaonlab.internal`,
        email: `demo.student.${Date.now()}@gaonlab.internal`,
        status: 'ACTIVATED',
        accountType: 'LEARNER',
      },
    });

    const person = await prisma.person.create({
      data: {
        accountId: account.id,
        displayName: 'Asha Rao (Demo)',
        preferredLanguage: 'en',
      },
    });

    return person.id;
  }

  /**
   * Start or resume an experiment session
   */
  async startSession(params: {
    experimentId: string;
    clientSessionId?: string;
    learnerPersonId?: string;
    boardId?: string;
    grade?: number;
    language?: string;
  }): Promise<ExperimentSessionResult> {
    await manifestLoader.loadAllManifests();
    let manifest = manifestLoader.getManifestById(params.experimentId);
    if (!manifest) {
      manifest = manifestLoader.getManifestByCode(params.experimentId);
    }

    if (!manifest) {
      throw new Error(`Experiment not found: ${params.experimentId}`);
    }

    const learnerPersonId = await this.resolveLearnerPersonId(params.learnerPersonId);

    // If client provided a clientSessionId, check if it already exists
    if (params.clientSessionId) {
      const existingClientSession = await prisma.experimentSession.findUnique({
        where: { clientSessionId: params.clientSessionId },
        include: { events: true },
      });
      if (existingClientSession) {
        return this.toResult(existingClientSession, manifest);
      }
    }

    // Find DB Experiment record
    let expRecord = await prisma.experiment.findUnique({
      where: { code: manifest.code },
      include: { versions: { where: { isLatest: true } } },
    });

    if (!expRecord) {
      await manifestLoader.syncToDatabase();
      expRecord = await prisma.experiment.findUnique({
        where: { code: manifest.code },
        include: { versions: { where: { isLatest: true } } },
      });
    }

    const versionRecord = expRecord?.versions[0];

    // Check for an existing ACTIVE session for this learner and experiment
    let session = await prisma.experimentSession.findFirst({
      where: {
        experimentId: expRecord ? expRecord.id : manifest.experimentId,
        learnerPersonId,
        status: 'ACTIVE',
      },
      orderBy: { updatedAt: 'desc' },
      include: { events: true },
    });

    if (!session && expRecord) {
      session = await prisma.experimentSession.create({
        data: {
          clientSessionId: params.clientSessionId || null,
          experimentId: expRecord.id,
          versionId: versionRecord?.id || null,
          learnerPersonId,
          status: 'ACTIVE',
          currentPhase: 'MISSION',
          predictionData: {},
          observationData: [],
          responsesData: {},
        },
        include: { events: true },
      });
    }

    return this.toResult(session, manifest);
  }

  /**
   * Reconcile an offline-created session idempotently
   */
  async reconcileSession(dto: ReconcileExperimentSessionDTO): Promise<ExperimentSessionResult> {
    if (!dto.clientSessionId) {
      const err: any = new Error('clientSessionId is required for reconciliation');
      err.statusCode = 400;
      throw err;
    }

    await manifestLoader.loadAllManifests();
    let manifest = manifestLoader.getManifestById(dto.experimentId);
    if (!manifest) {
      manifest = manifestLoader.getManifestByCode(dto.experimentId);
    }
    if (!manifest) {
      const err: any = new Error(`Experiment not found: ${dto.experimentId}`);
      err.statusCode = 404;
      throw err;
    }

    // Check if session already exists by clientSessionId
    const existingSession = await prisma.experimentSession.findUnique({
      where: { clientSessionId: dto.clientSessionId },
      include: { experiment: true, events: true },
    });

    if (existingSession) {
      // Validate multi-learner isolation if learnerPersonId is specified
      if (dto.learnerPersonId && existingSession.learnerPersonId !== dto.learnerPersonId) {
        const resolvedCandidate = await this.resolveLearnerPersonId(dto.learnerPersonId);
        if (existingSession.learnerPersonId !== resolvedCandidate && existingSession.learnerPersonId !== dto.learnerPersonId) {
          const err: any = new Error('Session learner mismatch: cross-learner reconciliation forbidden');
          err.statusCode = 403;
          throw err;
        }
      }

      // Idempotently apply any advanced state from the client snapshot
      const updates: Record<string, any> = {
        lastActiveAt: new Date(),
      };

      if (dto.isCompleted && existingSession.status !== 'COMPLETED') {
        updates.status = 'COMPLETED';
        updates.completedAt = dto.completedAt ? new Date(dto.completedAt) : new Date();
      }

      if (dto.currentPhase && dto.currentPhase !== existingSession.currentPhase) {
        updates.currentPhase = dto.currentPhase;
      }

      if (dto.predictionData && Object.keys(dto.predictionData).length > 0) {
        updates.predictionData = dto.predictionData;
      }

      if (Array.isArray(dto.observationData) && dto.observationData.length > 0) {
        const existingObs = Array.isArray(existingSession.observationData) ? (existingSession.observationData as any[]) : [];
        // Preserve union of observations
        if (dto.observationData.length >= existingObs.length) {
          updates.observationData = dto.observationData;
        }
      }

      if (dto.responsesData && Object.keys(dto.responsesData).length > 0) {
        updates.responsesData = {
          ...(typeof existingSession.responsesData === 'object' && existingSession.responsesData !== null ? existingSession.responsesData : {}),
          ...dto.responsesData,
        };
      }

      if (dto.hintsUsedCount !== undefined && dto.hintsUsedCount > existingSession.hintsUsedCount) {
        updates.hintsUsedCount = dto.hintsUsedCount;
      }

      if (dto.reflectionNote && !existingSession.reflectionNote) {
        updates.reflectionNote = dto.reflectionNote;
      }

      const updated = await prisma.experimentSession.update({
        where: { id: existingSession.id },
        data: updates,
        include: { events: true },
      });

      return this.toResult(updated, manifest);
    }

    // Session does not exist yet: create it with clientSessionId
    const learnerPersonId = await this.resolveLearnerPersonId(dto.learnerPersonId);

    let expRecord = await prisma.experiment.findUnique({
      where: { code: manifest.code },
      include: { versions: { where: { isLatest: true } } },
    });

    if (!expRecord) {
      await manifestLoader.syncToDatabase();
      expRecord = await prisma.experiment.findUnique({
        where: { code: manifest.code },
        include: { versions: { where: { isLatest: true } } },
      });
    }

    const versionRecord = expRecord?.versions[0];

    const newSession = await prisma.experimentSession.create({
      data: {
        clientSessionId: dto.clientSessionId,
        experimentId: expRecord ? expRecord.id : manifest.experimentId,
        versionId: versionRecord?.id || null,
        learnerPersonId,
        status: dto.isCompleted ? 'COMPLETED' : 'ACTIVE',
        currentPhase: dto.currentPhase || 'MISSION',
        predictionData: dto.predictionData || {},
        observationData: dto.observationData || [],
        responsesData: dto.responsesData || {},
        hintsUsedCount: dto.hintsUsedCount || 0,
        reflectionNote: dto.reflectionNote || null,
        startedAt: dto.startedAt ? new Date(dto.startedAt) : new Date(),
        completedAt: dto.completedAt ? new Date(dto.completedAt) : (dto.isCompleted ? new Date() : null),
      },
      include: { events: true },
    });

    return this.toResult(newSession, manifest);
  }

  /**
   * Retrieve session with recorded observations and manifest
   * Resolves by either internal DB id or clientSessionId
   */
  async getSession(sessionId: string): Promise<ExperimentSessionResult | null> {
    const session = await prisma.experimentSession.findFirst({
      where: {
        OR: [{ id: sessionId }, { clientSessionId: sessionId }],
      },
      include: {
        experiment: true,
        events: { orderBy: { timestamp: 'asc' } },
      },
    });

    if (!session) return null;

    let manifest = manifestLoader.getManifestByCode(session.experiment.code);
    if (!manifest) {
      manifest = manifestLoader.getManifestById(session.experimentId);
    }

    if (!manifest) {
      throw new Error(`Manifest not found for session experiment: ${session.experimentId}`);
    }

    return this.toResult(session, manifest);
  }

  /**
   * Ingest lifecycle event idempotently
   * Dual-key lookup by internal id or clientSessionId
   */
  async ingestEvent(
    sessionId: string,
    eventDto: IngestExperimentEventDTO
  ): Promise<{
    success: boolean;
    eventId: string;
    deduplicated: boolean;
    currentPhase: ExperimentLifecyclePhase;
  }> {
    const session = await prisma.experimentSession.findFirst({
      where: {
        OR: [{ id: sessionId }, { clientSessionId: sessionId }],
      },
    });

    if (!session) {
      const err: any = new Error(`Session not found: ${sessionId}`);
      err.statusCode = 404;
      throw err;
    }

    // Idempotent deduplication check
    const existingEvent = await prisma.experimentEvent.findUnique({
      where: { clientEventId: eventDto.clientEventId },
    });

    if (existingEvent) {
      logger.info(`Idempotent deduplication: event ${eventDto.clientEventId} already recorded`);
      return {
        success: true,
        eventId: existingEvent.id,
        deduplicated: true,
        currentPhase: session.currentPhase as ExperimentLifecyclePhase,
      };
    }

    // Persist new event with canonical session.id
    const recordedEvent = await prisma.experimentEvent.create({
      data: {
        sessionId: session.id,
        clientEventId: eventDto.clientEventId,
        eventType: eventDto.eventType,
        phase: (eventDto.phase || session.currentPhase) as any,
        payloadJson: eventDto.payload || {},
        timestamp: eventDto.timestamp ? new Date(eventDto.timestamp) : new Date(),
      },
    });

    // Update Session state based on event type
    const updates: Record<string, any> = {
      lastActiveAt: new Date(),
    };

    if (eventDto.phase && eventDto.phase !== session.currentPhase) {
      updates.currentPhase = eventDto.phase;
    }

    if (eventDto.eventType === 'PREDICTION_SUBMITTED') {
      updates.predictionData = eventDto.payload;
    } else if (eventDto.eventType === 'OBSERVATION_RECORDED') {
      const currentObs = Array.isArray(session.observationData)
        ? (session.observationData as any[])
        : [];
      updates.observationData = [...currentObs, eventDto.payload];
    } else if (eventDto.eventType === 'QUESTION_ANSWERED') {
      const currentResp =
        session.responsesData && typeof session.responsesData === 'object'
          ? (session.responsesData as Record<string, any>)
          : {};
      updates.responsesData = {
        ...currentResp,
        [eventDto.payload.questionId || `q_${Date.now()}`]: eventDto.payload,
      };
    } else if (eventDto.eventType === 'HINT_REQUESTED') {
      updates.hintsUsedCount = (session.hintsUsedCount || 0) + 1;
    }

    await prisma.experimentSession.update({
      where: { id: session.id },
      data: updates,
    });

    return {
      success: true,
      eventId: recordedEvent.id,
      deduplicated: false,
      currentPhase: (updates.currentPhase || session.currentPhase) as ExperimentLifecyclePhase,
    };
  }

  /**
   * Finalize and mark session complete
   * Dual-key lookup by internal id or clientSessionId
   */
  async completeSession(
    sessionId: string,
    reflectionData?: { reflectionNote?: string; finalScore?: number }
  ): Promise<ExperimentSessionResult> {
    const targetSession = await prisma.experimentSession.findFirst({
      where: {
        OR: [{ id: sessionId }, { clientSessionId: sessionId }],
      },
    });

    if (!targetSession) {
      const err: any = new Error(`Session not found: ${sessionId}`);
      err.statusCode = 404;
      throw err;
    }

    const session = await prisma.experimentSession.update({
      where: { id: targetSession.id },
      data: {
        status: 'COMPLETED',
        currentPhase: 'COMPLETED',
        completedAt: new Date(),
        reflectionNote: reflectionData?.reflectionNote,
      },
      include: {
        experiment: true,
        events: true,
      },
    });

    let manifest = manifestLoader.getManifestByCode(session.experiment.code);
    if (!manifest) {
      manifest = manifestLoader.getManifestById(session.experimentId);
    }

    if (!manifest) {
      throw new Error(`Manifest not found for session experiment: ${session.experimentId}`);
    }

    return this.toResult(session, manifest);
  }

  private toResult(
    session: any,
    manifest: ExperimentManifest
  ): ExperimentSessionResult {
    const observations = Array.isArray(session.observationData)
      ? session.observationData
      : [];

    const responses =
      session.responsesData && typeof session.responsesData === 'object'
        ? session.responsesData
        : {};

    const sessionDTO: ExperimentSessionDTO = {
      id: session.id,
      clientSessionId: session.clientSessionId || undefined,
      experimentId: manifest.experimentId,
      experimentVersionId: session.versionId || manifest.version,
      learnerPersonId: session.learnerPersonId,
      boardId: 'CBSE',
      grade: manifest.gradeRange.min,
      language: 'en',
      currentPhase: session.currentPhase as ExperimentLifecyclePhase,
      isCompleted: session.status === 'COMPLETED',
      startedAt: session.startedAt?.toISOString() || new Date().toISOString(),
      completedAt: session.completedAt?.toISOString(),
      lastActiveAt: session.lastActiveAt?.toISOString() || new Date().toISOString(),
      predictionData: session.predictionData,
      observationData: observations,
      responsesData: responses,
      reflectionNote: session.reflectionNote || undefined,
      summaryData: {
        predictionSelected: session.predictionData?.optionId,
        observationsCount: observations.length,
        questionsAnsweredCount: Object.keys(responses).length,
        hintsUsedCount: session.hintsUsedCount || 0,
        applicationCompleted: session.status === 'COMPLETED',
      },
    };

    return {
      session: sessionDTO,
      manifest,
      recordedObservations: observations,
      isCompleted: session.status === 'COMPLETED',
    };
  }
}

export const experimentSessionService = new ExperimentSessionService();
