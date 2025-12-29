import type { NextFunction, Request, Response } from 'express';
import type { Logger } from '../../../../application/ports/logger.js';
import { AppError } from '../../../../core/errors/app-error.js';
import { ensureError } from '../../../../core/utils/error.js';

export const createErrorHandler = ({ logger }: { logger: Logger }) => {
    return (
        rawErr: unknown,
        req: Request,
        res: Response,
        _next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
    ): void => {
        // Should already be an Error in most cases
        const err = ensureError(rawErr);

        // We check if it's an application error
        if (err instanceof AppError) {
            const message = err.message;
            res.status(err.statusCode).json({
                success: false,
                message,
                code: err.code,
                fields: err.fields,
                action: err.action,
            });
            logger.warn(message, {
                err,
                userId: req.user?.id,
                transactionId: req.transaction?.id,
            });
            return;
        }

        // All others errors
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        logger.error(err.message, {
            err,
            userId: req.user?.id,
            transactionId: req.transaction?.id,
        });
    };
};
