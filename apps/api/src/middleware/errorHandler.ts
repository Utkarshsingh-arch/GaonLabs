import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors';
import { logger } from '../shared/utils/logger';
import { sendError } from '../shared/utils/response';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error('Non-operational AppError occurred', {
        name: err.name,
        message: err.message,
        path: req.path,
        method: req.method,
      });
    }
    sendError(res, err.message, err.statusCode, err.name, err.details);
    return;
  }

  // Unhandled / system errors
  logger.error('Unhandled internal exception', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  sendError(res, message, 500, 'INTERNAL_SERVER_ERROR');
}
