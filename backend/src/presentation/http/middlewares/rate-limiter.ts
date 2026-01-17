import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';
import type { ApiError } from '../../types/api.js';

export const rateLimiterMiddleware = () => {
    return rateLimit({
        windowMs: 60 * 1000,
        limit: 60,
        handler: (req: Request, res: Response) => {
            const response: ApiError = {
                success: false,
                code: 'TOO_MANY_REQUESTS',
                message: 'Too many requests',
            };
            res.status(429).json(response);
        },
    });
};
