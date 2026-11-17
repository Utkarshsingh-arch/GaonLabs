import { env } from '../../config/env';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_WEIGHTS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function shouldLog(level: LogLevel): boolean {
  return LEVEL_WEIGHTS[level] >= LEVEL_WEIGHTS[env.LOG_LEVEL];
}

function formatLog(level: LogLevel, message: string, context?: Record<string, unknown>): string {
  const logObject = {
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    message,
    ...(context ? { context } : {}),
  };
  return JSON.stringify(logObject);
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>) {
    if (shouldLog('debug')) {
      console.debug(formatLog('debug', message, context));
    }
  },
  info(message: string, context?: Record<string, unknown>) {
    if (shouldLog('info')) {
      console.info(formatLog('info', message, context));
    }
  },
  warn(message: string, context?: Record<string, unknown>) {
    if (shouldLog('warn')) {
      console.warn(formatLog('warn', message, context));
    }
  },
  error(message: string, context?: Record<string, unknown>) {
    if (shouldLog('error')) {
      console.error(formatLog('error', message, context));
    }
  },
};
