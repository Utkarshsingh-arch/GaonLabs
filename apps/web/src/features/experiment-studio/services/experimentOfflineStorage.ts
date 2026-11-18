import {
  ExperimentManifest,
  ExperimentSessionDTO,
  IngestExperimentEventDTO,
} from '@gaonlab/shared-types';

const DB_NAME = 'gaonlab_experiment_studio_db';
const DB_VERSION = 2;

export interface OutboxEventRecord {
  clientEventId: string;
  sessionId: string;
  learnerPersonId?: string;
  event: IngestExperimentEventDTO;
  timestamp: string;
  synced: boolean;
  retryCount?: number;
  lastError?: string;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const tx = (event.target as IDBOpenDBRequest).transaction;

      if (!db.objectStoreNames.contains('manifests')) {
        const manifestStore = db.createObjectStore('manifests', { keyPath: 'experimentId' });
        manifestStore.createIndex('code', 'code', { unique: true });
      }

      let sessionStore: IDBObjectStore;
      if (!db.objectStoreNames.contains('sessions')) {
        sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
      } else {
        sessionStore = tx!.objectStore('sessions');
      }

      if (!sessionStore.indexNames.contains('clientSessionId')) {
        sessionStore.createIndex('clientSessionId', 'clientSessionId', { unique: false });
      }
      if (!sessionStore.indexNames.contains('learnerPersonId')) {
        sessionStore.createIndex('learnerPersonId', 'learnerPersonId', { unique: false });
      }
      if (!sessionStore.indexNames.contains('experimentId')) {
        sessionStore.createIndex('experimentId', 'experimentId', { unique: false });
      }
      if (!sessionStore.indexNames.contains('learner_experiment')) {
        sessionStore.createIndex('learner_experiment', ['learnerPersonId', 'experimentId'], { unique: false });
      }

      let outboxStore: IDBObjectStore;
      if (!db.objectStoreNames.contains('eventOutbox')) {
        outboxStore = db.createObjectStore('eventOutbox', { keyPath: 'clientEventId' });
      } else {
        outboxStore = tx!.objectStore('eventOutbox');
      }

      if (!outboxStore.indexNames.contains('sessionId')) {
        outboxStore.createIndex('sessionId', 'sessionId', { unique: false });
      }
      if (!outboxStore.indexNames.contains('synced')) {
        outboxStore.createIndex('synced', 'synced', { unique: false });
      }
      if (!outboxStore.indexNames.contains('timestamp')) {
        outboxStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function cacheManifest(manifest: ExperimentManifest): Promise<void> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('manifests', 'readwrite');
      const store = tx.objectStore('manifests');
      const req = store.put(manifest);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to cache experiment manifest in IndexedDB:', err);
  }
}

export async function getCachedManifest(idOrCode: string): Promise<ExperimentManifest | null> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction('manifests', 'readonly');
      const store = tx.objectStore('manifests');

      const byIdReq = store.get(idOrCode);
      byIdReq.onsuccess = () => {
        if (byIdReq.result) {
          resolve(byIdReq.result);
          return;
        }

        const codeIdx = store.index('code');
        const byCodeReq = codeIdx.get(idOrCode);
        byCodeReq.onsuccess = () => resolve(byCodeReq.result || null);
        byCodeReq.onerror = () => resolve(null);
      };
      byIdReq.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function getAllCachedManifests(): Promise<ExperimentManifest[]> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction('manifests', 'readonly');
      const store = tx.objectStore('manifests');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function saveLocalSession(session: ExperimentSessionDTO): Promise<void> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sessions', 'readwrite');
      const store = tx.objectStore('sessions');
      const req = store.put(session);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to save local session:', err);
  }
}

export async function getLocalSession(sessionId: string): Promise<ExperimentSessionDTO | null> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction('sessions', 'readonly');
      const store = tx.objectStore('sessions');
      const req = store.get(sessionId);
      req.onsuccess = () => {
        if (req.result) {
          resolve(req.result);
          return;
        }
        // Try searching by clientSessionId index
        if (store.indexNames.contains('clientSessionId')) {
          const clientIdx = store.index('clientSessionId');
          const clientReq = clientIdx.get(sessionId);
          clientReq.onsuccess = () => resolve(clientReq.result || null);
          clientReq.onerror = () => resolve(null);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function getAllLocalSessions(): Promise<ExperimentSessionDTO[]> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction('sessions', 'readonly');
      const store = tx.objectStore('sessions');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function getActiveSessionForLearner(
  learnerPersonId: string,
  experimentIdOrCode: string
): Promise<ExperimentSessionDTO | null> {
  try {
    const all = await getAllLocalSessions();
    const active = all.filter(
      (s) =>
        s.learnerPersonId === learnerPersonId &&
        (s.experimentId === experimentIdOrCode || s.experimentVersionId === experimentIdOrCode) &&
        !s.isCompleted
    );

    if (active.length === 0) return null;
    // Sort by last active timestamp descending
    active.sort(
      (a, b) => new Date(b.lastActiveAt || 0).getTime() - new Date(a.lastActiveAt || 0).getTime()
    );
    return active[0];
  } catch {
    return null;
  }
}

export async function queueOutboxEvent(
  sessionId: string,
  event: IngestExperimentEventDTO,
  learnerPersonId?: string
): Promise<void> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('eventOutbox', 'readwrite');
      const store = tx.objectStore('eventOutbox');
      const record: OutboxEventRecord = {
        clientEventId: event.clientEventId,
        sessionId,
        learnerPersonId,
        event,
        timestamp: event.timestamp || new Date().toISOString(),
        synced: false,
        retryCount: 0,
      };
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to queue event in outbox:', err);
  }
}

export async function getPendingOutboxEvents(): Promise<OutboxEventRecord[]> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction('eventOutbox', 'readonly');
      const store = tx.objectStore('eventOutbox');
      const req = store.getAll();
      req.onsuccess = () => {
        const all: OutboxEventRecord[] = req.result || [];
        const pending = all.filter((r) => !r.synced);
        pending.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        resolve(pending);
      };
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function markEventSynced(clientEventId: string): Promise<void> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('eventOutbox', 'readwrite');
      const store = tx.objectStore('eventOutbox');
      const getReq = store.get(clientEventId);
      getReq.onsuccess = () => {
        if (getReq.result) {
          const item = getReq.result;
          item.synced = true;
          const putReq = store.put(item);
          putReq.onsuccess = () => resolve();
          putReq.onerror = () => reject(putReq.error);
        } else {
          resolve();
        }
      };
      getReq.onerror = () => reject(getReq.error);
    });
  } catch (err) {
    console.warn('Failed to mark event synced:', err);
  }
}

export async function purgeSyncedEvents(): Promise<void> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction('eventOutbox', 'readwrite');
      const store = tx.objectStore('eventOutbox');
      const req = store.getAll();
      req.onsuccess = () => {
        const all: OutboxEventRecord[] = req.result || [];
        for (const record of all) {
          if (record.synced) {
            store.delete(record.clientEventId);
          }
        }
        resolve();
      };
      req.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('Failed to purge synced events:', err);
  }
}

export async function getPendingCount(): Promise<number> {
  try {
    const pendingEvents = await getPendingOutboxEvents();
    return pendingEvents.length;
  } catch {
    return 0;
  }
}
