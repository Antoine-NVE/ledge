import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../../infrastructure/errors/http-error';
import { Env } from '../../../infrastructure/types/env-type';
import { Logger } from 'pino';

export const createErrorHandlerMiddleware = (
    nodeEnv: Env['NODE_ENV'],
    logger: Logger,
) => {
    return (
        err: Error,
        req: Request,
        res: Response,
        next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
    ): void => {
        const isHttpError = err instanceof HttpError;
        const status = isHttpError ? err.status : 500;

        if (nodeEnv === 'development') {
            res.status(status).json({
                message: err.message,
                errors: isHttpError ? err.errors : undefined,
                meta: isHttpError ? err.meta : undefined,
            });
            return;
        }

        if (isHttpError && status < 500) {
            res.status(status).json({
                message: err.message,
                errors: err.errors,
                meta: err.meta,
            });
            return;
        }

        logger.error({ err }, 'Unhandled error middleware');
        res.status(status).json({
            message: 'Internal server error',
        });
    };
};
