import type { Logger } from '../../../application/ports/logger.js';
import type { NextFunction, Request, Response } from 'express';
import type { TokenGenerator } from '../../../application/ports/token-generator.js';

export const requestLoggerMiddleware = ({
    logger,
    tokenGenerator,
}: {
    logger: Logger;
    tokenGenerator: TokenGenerator;
}) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const startTime = performance.now();

        req.logger = logger.child({
            requestId: tokenGenerator.generate(16),
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
