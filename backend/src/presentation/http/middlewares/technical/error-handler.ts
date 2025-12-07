import { NextFunction, Request, Response } from 'express';
import { Logger } from '../../../../application/ports/logger';
import { AppError } from '../../../../core/errors/app-error';
import { UnauthorizedError } from '../../../../core/errors/unauthorized-error';
import { ForbiddenError } from '../../../../core/errors/forbidden-error';
import { NotFoundError } from '../../../../core/errors/not-found-error';
import { ConflictError } from '../../../../core/errors/conflict-error';
import { TooManyRequestsError } from '../../../../core/errors/too-many-requests-error';
import { flattenError, ZodError } from 'zod';

const httpErrorMap = new Map<
    new (
        message?: string,
        errors?: Record<string, string[]>,
        meta?: Record<string, unknown>,
    ) => AppError,
    number
>([
    [UnauthorizedError, 401],
    [ForbiddenError, 403],
    [NotFoundError, 404],
    [ConflictError, 409],
    [TooManyRequestsError, 429],
]);

export const createErrorHandler = ({ logger }: { logger: Logger }) => {
    return (
        err: Error,
        req: Request,
        res: Response,
        _next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
    ): void => {
        // We check if it's a validation error
        if (err instanceof ZodError) {
            const message = 'Validation error';
            logger.warn(message, {
                err,
                userId: req.user?.id,
                transactionId: req.transaction?.id,
            });
            res.status(400).json({
                message,
                errors: flattenError(err).fieldErrors,
            });
            return;
        }

        // We check if it's an application error
        for (const [errorClass, status] of httpErrorMap) {
            if (err instanceof errorClass) {
                const message = err.message;
                logger.warn(message, {
                    err,
                    userId: req.user?.id,
                    transactionId: req.transaction?.id,
                });
                res.status(status).json({
                    message,
                });
                return;
            }
        }

        // All others errors
        const message = 'Internal server error';
        logger.error(message, {
            err,
            userId: req.user?.id,
            transactionId: req.transaction?.id,
        });
        res.status(500).json({
            message,
        });
    };
};
