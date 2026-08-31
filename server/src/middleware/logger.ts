import { pinoHttp } from 'pino-http';
import { logger } from '../utils/logger.js';
import type { Request, Response } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';

export const requestLogger = pinoHttp({
  logger,
  customLogLevel: function (req: IncomingMessage, res: ServerResponse, err?: Error) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500 || err) {
      return 'error';
    }
    return 'info';
  },
  serializers: {
    req: (req: any) => {
      // Exclude noisy headers or let pino handle it via redaction
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        remoteAddress: req.remoteAddress,
        remotePort: req.remotePort,
        body: req.raw?.body || req.body // Add body to be serialized so it can be redacted
      };
    },
    res: (res: any) => ({
      statusCode: res.statusCode,
    }),
  },
});
