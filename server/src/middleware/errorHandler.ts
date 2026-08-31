import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error({ err, req }, 'Unhandled Exception');

  res.status(500).json({
    message: 'An internal server error occurred',
  });
};
