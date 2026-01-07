import type { NextFunction, Request, Response } from 'express';
import { ensureError } from '../../../core/utils/error.js';
import { AppError } from '../../../core/errors/app-error.js';
import type { ApiError } from '../../types/api.js';
import { ZodError } from 'zod';

export const errorHandler = (
    rawErr: unknown,
    req: Request,
    res: Response,
    _next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
): void => {
    const err = ensureError(rawErr); // Should already be an Error in most cases
    console.log(err);
    const response: ApiError = {
        success: false,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
    };

    // We check if it's an application error
    if (err instanceof AppError) {
        response.code = err.code;
        response.message = err.message;

        if (err.action) response.action = err.action;

        if (err.cause instanceof ZodError) {
            // TODO: find a better way
            response.errors = err.cause.format();
        }

        res.status(err.statusCode).json(response);
        return;
    }

    // All others errors
    res.status(500).json(response);
};
