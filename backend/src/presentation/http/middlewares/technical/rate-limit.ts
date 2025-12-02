import rateLimit from 'express-rate-limit';
import { TooManyRequestsError } from '../../../../infrastructure/errors/too-many-requests-error';

export const rateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    handler: () => {
        throw new TooManyRequestsError();
    },
});
