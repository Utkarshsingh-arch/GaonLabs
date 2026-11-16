import { AuditActionCategory } from '@gaonlab/shared-types';

export interface LogAuditActionInput {
  actorAccountId?: string;
  category: AuditActionCategory;
  action: string;
  targetResourceType: string;
  targetResourceId: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface IAuditService {
  logAction(input: LogAuditActionInput): Promise<any>;
  listEventsByTarget(targetResourceType: string, targetResourceId: string): Promise<any[]>;
}
