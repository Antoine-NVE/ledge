import rateLimit from 'express-rate-limit';
import { TooManyRequestsError } from '../../errors/too-many-requests-error';

export const rateLimitMiddleware = rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    handler: () => {
        throw new TooManyRequestsError();
    },
});
