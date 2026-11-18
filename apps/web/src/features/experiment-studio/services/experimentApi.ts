import {
  ExperimentManifest,
  ExperimentSessionDTO,
  ExperimentSessionResult,
  ExperimentSummary,
  ExperimentSyncState,
  IngestExperimentEventDTO,
} from '@gaonlab/shared-types';
import {
  cacheManifest,
  getCachedManifest,
  getAllCachedManifests,
  saveLocalSession,
  getLocalSession,
  getAllLocalSessions,
  getActiveSessionForLearner,
  queueOutboxEvent,
  getPendingOutboxEvents,
  markEventSynced,
  purgeSyncedEvents,
  getPendingCount,
} from './experimentOfflineStorage';

const API_BASE = '/api/v1/experiments';

export function generateClientUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface ExperimentQueryFilters {
  boardId?: string;
  grade?: number;
  subjectId?: string;
  simulationType?: string;
  language?: string;
}

export async function fetchExperiments(
  filters: ExperimentQueryFilters = {}
): Promise<ExperimentSummary[]> {
  const query = new URLSearchParams();
  if (filters.boardId) query.set('boardId', filters.boardId);
  if (filters.grade) query.set('grade', filters.grade.toString());
  if (filters.subjectId) query.set('subjectId', filters.subjectId);
  if (filters.simulationType) query.set('simulationType', filters.simulationType);
  if (filters.language) query.set('language', filters.language);

  try {
    const res = await fetch(`${API_BASE}?${query.toString()}`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.warn('Network request failed, falling back to cached offline experiments:', err);
    const cachedManifests = await getAllCachedManifests();
    return cachedManifests.map((m) => ({
      id: m.experimentId,
      code: m.code,
      title: m.title,
      titleInLanguage: m.titleInLanguage,
      shortDescription: m.shortDescription,
      subject: m.subject,
      stemPillar: m.stemPillar,
      minGrade: m.gradeRange.min,
      maxGrade: m.gradeRange.max,
      simulationType: m.simulation.type,
      executionMode: m.safetyProfile.mode,
      safetyStatus: m.safetyProfile.reviewStatus,
      isOfflineEligible: m.offlineEligibility,
      thumbnailUrl: `/assets/experiments/thumbnails/${m.code.toLowerCase()}.png`,
      supportedLanguages: m.supportedLanguages,
      curriculumMappings: m.curriculumMappings,
    }));
  }
}

export async function fetchExperimentManifest(
  idOrCode: string
): Promise<ExperimentManifest> {
  try {
    const res = await fetch(`${API_BASE}/${idOrCode}/manifest`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();
    const manifest = data.data as ExperimentManifest;
    await cacheManifest(manifest);
    return manifest;
  } catch (err) {
    console.warn('Network manifest fetch failed, attempting IndexedDB cache retrieval:', err);
    const cached = await getCachedManifest(idOrCode);
    if (cached) return cached;
    throw err;
  }
}

export async function startExperimentSession(
  idOrCode: string,
  params: {
    learnerPersonId?: string;
    boardId?: string;
    grade?: number;
    language?: string;
  } = {}
): Promise<ExperimentSessionResult> {
  const learnerId = params.learnerPersonId || 'local-demo-learner';

  // 1. Check if an active session already exists locally in IndexedDB (Reload/re-entry persistence)
  const existingActive = await getActiveSessionForLearner(learnerId, idOrCode);
  if (existingActive) {
    const manifest = await fetchExperimentManifest(idOrCode);
    return {
      session: existingActive,
      manifest,
      recordedObservations: existingActive.observationData || [],
      isCompleted: existingActive.isCompleted,
    };
  }

  // 2. Prepare stable client session UUID
  const clientSessionId = generateClientUuid();

  try {
    const res = await fetch(`${API_BASE}/${idOrCode}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        clientSessionId,
      }),
    });

    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();
    const result = data.data as ExperimentSessionResult;
    await saveLocalSession(result.session);
    await cacheManifest(result.manifest);
    notifySyncListeners('SYNCED', 0);
    return result;
  } catch (err) {
    console.warn('Failed to start session on server, creating local offline session:', err);
    const manifest = await fetchExperimentManifest(idOrCode);
    const localSession: ExperimentSessionDTO = {
      id: clientSessionId,
      clientSessionId,
      experimentId: manifest.experimentId,
      experimentVersionId: manifest.version,
      learnerPersonId: learnerId,
      boardId: params.boardId || 'CBSE',
      grade: params.grade || manifest.gradeRange.min,
      language: params.language || 'en',
      currentPhase: 'MISSION' as const,
      isCompleted: false,
      startedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      predictionData: {},
      observationData: [],
      responsesData: {},
    };
    await saveLocalSession(localSession);
    notifySyncListeners('SAVED_LOCAL', 0);
    return {
      session: localSession,
      manifest,
      recordedObservations: [],
      isCompleted: false,
    };
  }
}

export async function reconcileLocalSession(
  session: ExperimentSessionDTO
): Promise<ExperimentSessionResult | null> {
  try {
    const res = await fetch(`${API_BASE}/sessions/reconcile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientSessionId: session.clientSessionId || session.id,
        experimentId: session.experimentId,
        experimentVersionId: session.experimentVersionId,
        learnerPersonId: session.learnerPersonId,
        boardId: session.boardId,
        grade: session.grade,
        language: session.language,
        currentPhase: session.currentPhase,
        predictionData: session.predictionData,
        observationData: session.observationData,
        responsesData: session.responsesData,
        hintsUsedCount: session.summaryData?.hintsUsedCount || 0,
        reflectionNote: session.reflectionNote,
        isCompleted: session.isCompleted,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const result = data.data as ExperimentSessionResult;
      await saveLocalSession(result.session);
      return result;
    }
  } catch (err) {
    console.warn('Session reconciliation network call failed, will retry later:', err);
  }
  return null;
}

export async function submitExperimentEvent(
  sessionId: string,
  eventDto: IngestExperimentEventDTO,
  learnerPersonId?: string
): Promise<{ success: boolean; deduplicated?: boolean }> {
  // Always queue in local IndexedDB outbox first
  await queueOutboxEvent(sessionId, eventDto, learnerPersonId);
  notifySyncListeners('WAITING_TO_SYNC', 1);

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { success: true };
  }

  try {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventDto),
    });

    if (res.ok) {
      await markEventSynced(eventDto.clientEventId);
      const data = await res.json();
      notifySyncListeners('SYNCED', 0);
      return data.data;
    }
  } catch (err) {
    console.warn('Event stored offline in IndexedDB outbox; will sync when reconnected:', err);
  }

  return { success: true };
}

export async function completeExperimentSession(
  sessionId: string,
  reflectionData: { reflectionNote?: string; finalScore?: number } = {}
): Promise<ExperimentSessionResult> {
  // 1. Immediately persist completion in local IndexedDB
  const local = await getLocalSession(sessionId);
  if (local) {
    local.isCompleted = true;
    local.completedAt = new Date().toISOString();
    local.currentPhase = 'COMPLETED';
    if (reflectionData.reflectionNote) {
      local.reflectionNote = reflectionData.reflectionNote;
    }
    await saveLocalSession(local);
  }

  try {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reflectionData),
    });

    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();
    const result = data.data as ExperimentSessionResult;
    await saveLocalSession(result.session);
    notifySyncListeners('SYNCED', 0);
    return result;
  } catch (err) {
    console.warn('Server completion failed, offline local session updated:', err);
    notifySyncListeners('WAITING_TO_SYNC', 1);
    if (local) {
      const manifest = await fetchExperimentManifest(local.experimentId);
      return {
        session: local,
        manifest,
        recordedObservations: local.observationData || [],
        isCompleted: true,
      };
    }
    throw err;
  }
}

// -----------------------------------------------------------------------------
// Synchronization Outbox Engine & State Dispatcher
// -----------------------------------------------------------------------------

let isSyncing = false;
const SYNC_EVENT_NAME = 'gaonlab_experiment_sync_event';

export function notifySyncListeners(state: ExperimentSyncState, pendingCount: number) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(SYNC_EVENT_NAME, {
        detail: { state, pendingCount },
      })
    );
  }
}

export function subscribeSyncState(
  callback: (detail: { state: ExperimentSyncState; pendingCount: number }) => void
): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (event: any) => callback(event.detail);
  window.addEventListener(SYNC_EVENT_NAME, handler);
  return () => window.removeEventListener(SYNC_EVENT_NAME, handler);
}

export async function flushExperimentOutbox(): Promise<void> {
  if (isSyncing) return;
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    const count = await getPendingCount();
    notifySyncListeners(count > 0 ? 'WAITING_TO_SYNC' : 'SAVED_LOCAL', count);
    return;
  }

  isSyncing = true;
  try {
    const pending = await getPendingOutboxEvents();
    const allSessions = await getAllLocalSessions();

    if (pending.length === 0) {
      notifySyncListeners('SYNCED', 0);
      isSyncing = false;
      return;
    }

    notifySyncListeners('SYNCHRONIZING', pending.length);

    // 1. Reconcile sessions for any pending events
    const sessionIds = Array.from(new Set(pending.map((p) => p.sessionId)));
    for (const sid of sessionIds) {
      const localSession = allSessions.find((s) => s.id === sid || s.clientSessionId === sid);
      if (localSession) {
        await reconcileLocalSession(localSession);
      }
    }

    // 2. Replay events in strict chronological order
    for (const item of pending) {
      try {
        const res = await fetch(`${API_BASE}/sessions/${item.sessionId}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.event),
        });

        if (res.ok) {
          await markEventSynced(item.clientEventId);
        } else if (res.status >= 400 && res.status < 500 && res.status !== 404) {
          // Client validation rejection: mark synced to prevent permanent queue blockage
          await markEventSynced(item.clientEventId);
        } else {
          // Server error or network issue: abort replay and retry later
          break;
        }
      } catch {
        break;
      }
    }

    // 3. Complete any completed local sessions on server
    for (const s of allSessions) {
      if (s.isCompleted) {
        try {
          await fetch(`${API_BASE}/sessions/${s.clientSessionId || s.id}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reflectionNote: s.reflectionNote,
              finalScore: 100,
            }),
          });
        } catch {
          // Will retry on next sync cycle
        }
      }
    }

    await purgeSyncedEvents();

    const remaining = await getPendingCount();
    if (remaining === 0) {
      notifySyncListeners('SYNCED', 0);
    } else {
      notifySyncListeners('WAITING_TO_SYNC', remaining);
    }
  } catch (err) {
    console.warn('Sync outbox failed:', err);
    const remaining = await getPendingCount();
    notifySyncListeners('NEEDS_ATTENTION', remaining);
  } finally {
    isSyncing = false;
  }
}

// Register automatic network and visibility triggers
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    flushExperimentOutbox();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      flushExperimentOutbox();
    }
  });
  // Initial flush on application bootstrap
  setTimeout(() => {
    flushExperimentOutbox();
  }, 1000);
}
