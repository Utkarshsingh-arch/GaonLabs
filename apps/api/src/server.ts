import { createApp } from './app';
import { env } from './config/env';
import { SYSTEM_CONSTANTS } from './config/constants';
import { disconnectDatabase } from './shared/database/prisma';
import { logger } from './shared/utils/logger';

const app = createApp();

const server = app.listen(env.PORT, env.HOST, () => {
  logger.info(`${SYSTEM_CONSTANTS.APP_NAME} started successfully`, {
    environment: env.NODE_ENV,
    host: env.HOST,
    port: env.PORT,
    version: SYSTEM_CONSTANTS.VERSION,
  });
  logger.info(`Health check: http://${env.HOST}:${env.PORT}/health`);
  logger.info(`Readiness check: http://${env.HOST}:${env.PORT}/ready`);
});

// Graceful shutdown
async function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}, initiating graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed, disconnecting database...');
    try {
      await disconnectDatabase();
      logger.info('Graceful shutdown completed successfully');
      process.exit(0);
    } catch (err: any) {
      logger.error('Error during shutdown database disconnection', { error: err?.message });
      process.exit(1);
    }
  });

  // Force close after 10s timeout
  setTimeout(() => {
    logger.error('Forced shutdown: connections did not close within timeout');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
