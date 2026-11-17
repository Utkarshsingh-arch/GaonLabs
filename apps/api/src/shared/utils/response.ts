import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: Record<string, unknown>;
  timestamp: string;
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200, meta?: Record<string, unknown>): Response {
  const payload: ApiResponse<T> = {
    success: true,
    data,
    meta,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  code = 'INTERNAL_ERROR',
  details?: Record<string, unknown>
): Response {
  const payload: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(payload);
}
