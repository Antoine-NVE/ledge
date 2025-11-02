import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../errors/http-error';
import { env } from '../../config/env';

export const errorHandlerMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
): void => {
    const isHttpError = err instanceof HttpError;
    const status = isHttpError ? err.status : 500;

    if (env.NODE_ENV === 'development') {
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

    console.error(err);
    res.status(status).json({
        message: 'Internal server error',
    });
};
