import type { NextFunction, Request, Response } from 'express';
import type { ApiError } from '@shared/api/api-response.js';
import { HttpError } from '../errors/http.error.js';
import httpErrors from 'http-errors';

export const errorHandlerMiddleware = () => {
    return (
        err: unknown,
        req: Request,
        res: Response,
        _next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
    ): void => {
        if (err instanceof HttpError) {
            req.logger.warn(err.message, { err });
            res.status(err.status).json(err.body);
            return;
        }

        if (err instanceof httpErrors.PayloadTooLarge) {
            req.logger.warn(err.message, { err });
            const response: ApiError = {
                success: false,
                code: 'PAYLOAD_TOO_LARGE',
            };
            res.status(err.status).json(response);
            return;
        }

        req.logger.error(err instanceof Error ? err.message : 'Unknown error', { err });
        const response: ApiError = {
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
        };
        res.status(500).json(response);
    };
};
