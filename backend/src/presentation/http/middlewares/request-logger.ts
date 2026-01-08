import type { Logger } from '../../../application/ports/logger.js';
import type { NextFunction, Request, Response } from 'express';
import { generateToken } from '../../../core/utils/token.js';

export const requestLogger = ({ logger }: { logger: Logger }) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const startTime = performance.now();

        req.logger = logger.child({
            requestId: generateToken(16),
        });

        req.logger.info('Request started', { method: req.method, url: req.url });

        res.on('finish', () => {
            const duration = Math.round(performance.now() - startTime);

            req.logger.info('Request completed', {
                duration: `${duration}ms`,
            });
        });

        next();
    };
};
