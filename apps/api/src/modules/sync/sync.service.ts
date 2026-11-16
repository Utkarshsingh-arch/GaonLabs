import { prisma } from '../../shared/database/prisma';
import { ISyncService, IngestSyncEventInput, RegisterDeviceInput } from './sync.contracts';
import { SyncRecordStatus } from '@gaonlab/shared-types';

export class SyncService implements ISyncService {
  async registerDevice(input: RegisterDeviceInput) {
    return prisma.syncDevice.upsert({
      where: { deviceId: input.deviceId },
      update: {
        accountPersonId: input.accountPersonId,
        deviceModel: input.deviceModel,
        osVersion: input.osVersion,
        appVersion: input.appVersion,
        lastSyncAt: new Date(),
      },
      create: {
        deviceId: input.deviceId,
        accountPersonId: input.accountPersonId,
        deviceModel: input.deviceModel,
        osVersion: input.osVersion,
        appVersion: input.appVersion,
        lastSyncAt: new Date(),
      },
    });
  }

  async ingestEvent(input: IngestSyncEventInput): Promise<{ eventId: string; status: SyncRecordStatus; isDuplicate: boolean }> {
    // Check if event has already been ingested (Idempotency guarantee)
    const existing = await prisma.syncEventRecord.findUnique({
      where: { eventId: input.eventId },
    });

    if (existing) {
      return {
        eventId: existing.eventId,
        status: 'DUPLICATE',
        isDuplicate: true,
      };
    }

    const created = await prisma.syncEventRecord.create({
      data: {
        eventId: input.eventId,
        deviceId: input.deviceId,
        learnerPersonId: input.learnerPersonId,
        eventType: input.eventType,
        payloadJson: input.payload as any,
        status: 'PROCESSED',
        processedAt: new Date(),
      },
    });

    return {
      eventId: created.eventId,
      status: 'PROCESSED',
      isDuplicate: false,
    };
  }

  async getDeviceSyncState(deviceId: string) {
    return prisma.syncDevice.findUnique({
      where: { deviceId },
      include: {
        events: {
          take: 20,
          orderBy: { receivedAt: 'desc' },
        },
      },
    });
  }
}

export const syncService = new SyncService();
