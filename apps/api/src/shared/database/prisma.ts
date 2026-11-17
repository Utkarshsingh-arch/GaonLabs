import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

export type DatabaseMode = 'PRIMARY_SUPABASE' | 'FALLBACK_LOCAL';

const primaryUrl = process.env.DATABASE_URL || '';
const fallbackUrl =
  process.env.FALLBACK_DATABASE_URL ||
  (process.env.POSTGRES_PORT === '54329'
    ? 'postgresql://postgres:postgres@localhost:54329/gaonlab_dev?schema=public'
    : 'postgresql://postgres:postgres@localhost:5432/gaonlab_dev?schema=public');

const primaryClient = new PrismaClient({
  datasources: { db: { url: primaryUrl } },
  log: [
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' },
  ],
});

const fallbackClient = new PrismaClient({
  datasources: { db: { url: fallbackUrl } },
  log: [
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' },
  ],
});

let currentMode: DatabaseMode = 'PRIMARY_SUPABASE';
let primaryHealthy = true;

export function getDatabaseMode(): DatabaseMode {
  return currentMode;
}

export function switchToFallback(reason?: string): void {
  if (currentMode !== 'FALLBACK_LOCAL') {
    currentMode = 'FALLBACK_LOCAL';
    primaryHealthy = false;
    logger.warn(`[Failover] Primary database (Supabase) unavailable. Seamlessly failing over to local database.`, {
      reason,
      fallbackUrl: fallbackUrl.replace(/:[^:]*@/, ':***@'),
    });
  }
}

export function switchToPrimary(): void {
  if (currentMode !== 'PRIMARY_SUPABASE') {
    currentMode = 'PRIMARY_SUPABASE';
    primaryHealthy = true;
    logger.info(`[Failover] Primary database (Supabase) connection restored.`);
  }
}

function getActiveClient(): PrismaClient {
  return currentMode === 'PRIMARY_SUPABASE' ? primaryClient : fallbackClient;
}

function isConnectionError(err: any): boolean {
  if (!err) return false;
  const msg = (err.message || String(err)).toLowerCase();
  return (
    msg.includes("can't reach database server") ||
    msg.includes('connection pool') ||
    msg.includes('timeout') ||
    msg.includes('timed out') ||
    msg.includes('econnrefused') ||
    msg.includes('enotfound') ||
    msg.includes('etimedout') ||
    msg.includes('network is unreachable') ||
    msg.includes('connection terminated') ||
    msg.includes('prismaclientinitializationerror') ||
    msg.includes('server closed the connection') ||
    msg.includes('expired transaction') ||
    msg.includes('transaction already closed') ||
    msg.includes('transaction not found')
  );
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    const active = getActiveClient() as any;
    const value = active[prop];

    // Top-level methods ($transaction, $queryRaw, $executeRaw, etc.)
    if (typeof value === 'function') {
      return async (...args: any[]) => {
        const client = getActiveClient() as any;
        try {
          return await client[prop](...args);
        } catch (err: any) {
          if (currentMode === 'PRIMARY_SUPABASE' && isConnectionError(err)) {
            switchToFallback(err.message?.split('\n')[0]);
            return await (fallbackClient as any)[prop](...args);
          }
          throw err;
        }
      };
    }

    // Prisma Model delegates (e.g. prisma.educationBoard, prisma.account, etc.)
    if (typeof value === 'object' && value !== null) {
      return new Proxy(value, {
        get(_modelTarget, modelProp) {
          const client = getActiveClient() as any;
          const targetProp = client[prop];
          if (!targetProp) return undefined;
          const method = targetProp[modelProp];

          if (typeof method === 'function') {
            return async (...args: any[]) => {
              const currentClient = getActiveClient() as any;
              try {
                return await currentClient[prop][modelProp](...args);
              } catch (err: any) {
                if (currentMode === 'PRIMARY_SUPABASE' && isConnectionError(err)) {
                  switchToFallback(err.message?.split('\n')[0]);
                  return await (fallbackClient as any)[prop][modelProp](...args);
                }
                throw err;
              }
            };
          }
          return method;
        },
      });
    }

    return value;
  },
});

export interface DatabaseHealthStatus {
  isHealthy: boolean;
  latencyMs: number;
  activeSource: DatabaseMode;
  primaryHealthy: boolean;
  fallbackHealthy?: boolean;
  error?: string;
}

export async function checkDatabaseConnection(): Promise<DatabaseHealthStatus> {
  const start = Date.now();

  // 1. If currently in PRIMARY, test Primary with a 5s health timeout
  if (currentMode === 'PRIMARY_SUPABASE') {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Primary connection health check timeout (5s)')), 5000)
      );
      await Promise.race([primaryClient.$queryRaw`SELECT 1`, timeoutPromise]);
      const latencyMs = Date.now() - start;
      primaryHealthy = true;
      return {
        isHealthy: true,
        latencyMs,
        activeSource: 'PRIMARY_SUPABASE',
        primaryHealthy: true,
      };
    } catch (primaryErr: any) {
      switchToFallback(primaryErr.message);
    }
  }

  // 2. If in FALLBACK or Primary check failed: test Fallback
  try {
    const fbStart = Date.now();
    await fallbackClient.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - fbStart;

    // Asynchronously probe primary to auto-restore when online
    primaryClient
      .$queryRaw`SELECT 1`
      .then(() => {
        switchToPrimary();
      })
      .catch(() => {
        // Still down
      });

    return {
      isHealthy: true,
      latencyMs,
      activeSource: 'FALLBACK_LOCAL',
      primaryHealthy: false,
      fallbackHealthy: true,
    };
  } catch (fallbackErr: any) {
    const latencyMs = Date.now() - start;
    logger.error('Both Primary (Supabase) and Fallback (Local) databases are unreachable', {
      error: fallbackErr?.message,
    });
    return {
      isHealthy: false,
      latencyMs,
      activeSource: currentMode,
      primaryHealthy: false,
      fallbackHealthy: false,
      error: fallbackErr?.message || 'Both database connections failed',
    };
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  await Promise.allSettled([primaryClient.$disconnect(), fallbackClient.$disconnect()]);
  logger.info('Database disconnected cleanly');
}
