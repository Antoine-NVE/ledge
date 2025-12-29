import { AppError, type AppErrorOptions } from './app-error.js';

export class TooManyRequestsError extends AppError {
    constructor(options?: AppErrorOptions) {
        super('Too many requests', 429, 'TOO_MANY_REQUESTS', options);
    }
}
