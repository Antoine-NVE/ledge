import type { NextFunction, Request, Response } from 'express';
import { ensureError } from '../../../core/utils/error.js';
import type { ApiError } from '../../types/api-response.js';

export const errorHandlerMiddleware = () => {
    return (
        rawErr: unknown,
        req: Request,
        res: Response,
        _next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
    ): void => {
        const err = ensureError(rawErr);
        req.logger.error(err.message, { err });

        const response: ApiError = {
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
        };
        res.status(500).json(response);
    };
};
