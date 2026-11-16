/**
 * Shared Events, Audit, and Sync Contracts
 */

export interface EventEnvelope<T = Record<string, unknown>> {
  eventId: string; // Globally unique UUID v4
  type: string;    // e.g. "ACCOUNT_CREATED", "CONSENT_GRANTED", "QUIZ_COMPLETED"
  schemaVersion: string; // e.g. "1.0.0"
  occurredAt: string;    // ISO 8601 UTC
  deviceId?: string;     // Unique client device identifier
  learnerId?: string;    // Subject learner UUID
  payload: T;
}

export type AuditActionCategory =
  | 'ACCOUNT'
  | 'CONSENT'
  | 'GUARDIAN_VERIFICATION'
  | 'SCHOOL_VERIFICATION'
  | 'ENROLLMENT'
  | 'CURRICULUM_MUTATION'
  | 'INTEGRATION_STATUS_CHANGE'
  | 'SECURITY_EVENT';

export interface AuditEventRecord {
  id: string; // UUID v4
  actorAccountId?: string;
  category: AuditActionCategory;
  action: string;
  targetResourceType: string;
  targetResourceId: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export type SyncRecordStatus = 'RECEIVED' | 'PROCESSED' | 'REJECTED' | 'DUPLICATE';

export interface SyncDeviceRegistration {
  id: string;
  deviceId: string;
  accountPersonId: string;
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  lastSyncAt: string;
  createdAt: string;
}

export interface SyncEventRecord {
  id: string;
  eventId: string; // Client-side event UUID for deduplication
  deviceId: string;
  learnerPersonId: string;
  eventType: string;
  payloadJson: Record<string, unknown>;
  status: SyncRecordStatus;
  receivedAt: string;
  processedAt?: string;
}
