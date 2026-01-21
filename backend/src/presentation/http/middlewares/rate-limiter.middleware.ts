import rateLimit from 'express-rate-limit';
import { TooManyRequestsError } from '../../errors/too-many-requests.error.js';

export const rateLimiterMiddleware = () => {
    return rateLimit({
        windowMs: 60 * 1000,
        limit: 60,
        handler: () => {
            throw new TooManyRequestsError();
        },
    });
};
