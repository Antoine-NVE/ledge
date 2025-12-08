import { AppError } from './app-error';

export class TooManyRequestsError extends AppError {
    constructor(
        message: string = 'Too many requests',
        fields?: Record<string, string[]>,
        cause?: unknown,
        action?: 'REFRESH',
    ) {
        super(message, fields, cause, action);
    }
}
