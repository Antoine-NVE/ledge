import { NextFunction, Request, Response } from 'express';
import { Logger } from '../../../../application/ports/logger';
import { HttpError } from '../../../../infrastructure/errors/http-error';

export const createErrorHandler = (
    nodeEnv: 'development' | 'production',
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
            const message = err.message;
            logger.warn(message, {
                err,
                userId: req.user?._id,
                transactionId: req.transaction?._id,
            });
            res.status(status).json({
                message,
                errors: err.errors,
                meta: err.meta,
            });
            return;
        }

        const message = 'Internal server error';
        logger.error(message, {
            err,
            userId: req.user?._id,
            transactionId: req.transaction?._id,
        });
        res.status(status).json({
            message,
        });
    };
};
