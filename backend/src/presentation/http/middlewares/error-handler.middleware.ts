import type { NextFunction, Request, Response } from 'express';
import type { ApiError } from '@shared/api/api-response.js';

export const errorHandlerMiddleware = () => {
    return (
        err: unknown,
        req: Request,
        res: Response,
        _next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
    ): void => {
        req.logger.error(err instanceof Error ? err.message : 'Unknown error', { err });
        const response: ApiError = {
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
        };
        res.status(500).json(response);
    };
};
