import rateLimit from 'express-rate-limit';
import httpErrors from 'http-errors';

export const rateLimiterMiddleware = () => {
    return rateLimit({
        windowMs: 60 * 1000,
        limit: 60,
        handler: () => {
            throw new httpErrors.TooManyRequests();
        },
    });
};
