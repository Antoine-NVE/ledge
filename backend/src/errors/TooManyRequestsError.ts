import { HttpError } from './HttpError';

export class TooManyRequestsError extends HttpError {
    constructor(
        message: string = 'Too many requests',
        errors?: Record<string, string[]>,
        meta?: Record<string, unknown>,
    ) {
        super(message, 429, errors, meta);
    }
}
