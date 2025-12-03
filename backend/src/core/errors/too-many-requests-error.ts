import { AppError } from './app-error';

export class TooManyRequestsError extends AppError {
    constructor(
        message: string = 'Too many requests',
        errors?: Record<string, string[]>,
        meta?: Record<string, unknown>,
    ) {
        super(message, errors, meta);
    }
}
