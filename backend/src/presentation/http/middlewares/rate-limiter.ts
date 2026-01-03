import rateLimit from 'express-rate-limit';
import { TooManyRequestsError } from '../../../core/errors/too-many-requests-error.js';

export const rateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    handler: () => {
        throw new TooManyRequestsError();
    },
});
