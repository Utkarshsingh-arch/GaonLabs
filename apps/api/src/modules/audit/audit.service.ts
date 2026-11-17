import { prisma } from '../../shared/database/prisma';
import { eventBus } from '../../shared/events';
import { logger } from '../../shared/utils/logger';
import { IAuditService, LogAuditActionInput } from './audit.contracts';
import { EventEnvelope } from '@gaonlab/shared-types';

export class AuditService implements IAuditService {
  constructor() {
    this.initEventListener();
  }

  private initEventListener() {
    eventBus.subscribe('*', async (event: EventEnvelope) => {
      try {
        await this.handleDomainEvent(event);
      } catch (err: any) {
        logger.error('Failed to log domain event into audit trail', {
          eventId: event.eventId,
          type: event.type,
          error: err?.message,
        });
      }
    });
  }

  private async handleDomainEvent(event: EventEnvelope) {
    let category: 'ACCOUNT' | 'CONSENT' | 'GUARDIAN_VERIFICATION' | 'SCHOOL_VERIFICATION' | 'ENROLLMENT' | 'CURRICULUM_MUTATION' | 'INTEGRATION_STATUS_CHANGE' | 'SECURITY_EVENT' = 'SECURITY_EVENT';

    if (event.type.startsWith('ACCOUNT')) category = 'ACCOUNT';
    else if (event.type.startsWith('CONSENT')) category = 'CONSENT';
    else if (event.type.startsWith('GUARDIAN')) category = 'GUARDIAN_VERIFICATION';
    else if (event.type.startsWith('SCHOOL')) category = 'SCHOOL_VERIFICATION';
    else if (event.type.startsWith('ACADEMIC')) category = 'ENROLLMENT';
    else if (event.type.startsWith('CURRICULUM')) category = 'CURRICULUM_MUTATION';
    else if (event.type.startsWith('INTEGRATION')) category = 'INTEGRATION_STATUS_CHANGE';

    // Sanitize payload: strip any password, token, or prohibited data
    const safePayload = { ...event.payload };
    delete (safePayload as any).password;
    delete (safePayload as any).passwordHash;
    delete (safePayload as any).token;

    await prisma.auditEvent.create({
      data: {
        category,
        action: event.type,
        targetResourceType: category,
        targetResourceId: event.learnerId || event.eventId,
        details: safePayload as any,
      },
    });
  }

  async logAction(input: LogAuditActionInput) {
    return prisma.auditEvent.create({
      data: {
        actorAccountId: input.actorAccountId,
        category: input.category,
        action: input.action,
        targetResourceType: input.targetResourceType,
        targetResourceId: input.targetResourceId,
        details: input.details as any,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });
  }

  async listEventsByTarget(targetResourceType: string, targetResourceId: string) {
    return prisma.auditEvent.findMany({
      where: {
        targetResourceType,
        targetResourceId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const auditService = new AuditService();
