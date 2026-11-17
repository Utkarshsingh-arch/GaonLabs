import { SyncRecordStatus } from '@gaonlab/shared-types';

export interface RegisterDeviceInput {
  deviceId: string;
  accountPersonId: string;
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
}

export interface IngestSyncEventInput {
  eventId: string; // Unique client UUID
  deviceId: string;
  learnerPersonId: string;
  eventType: string;
  payload: Record<string, unknown>;
}

export interface ISyncService {
  registerDevice(input: RegisterDeviceInput): Promise<any>;
  ingestEvent(input: IngestSyncEventInput): Promise<{ eventId: string; status: SyncRecordStatus; isDuplicate: boolean }>;
  getDeviceSyncState(deviceId: string): Promise<any>;
}
