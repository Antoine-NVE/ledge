import { AppError } from './app-error';

export class TooManyRequestsError extends AppError {
    constructor(
        message: string = 'Too many requests',
        cause?: unknown,
        fields?: Record<string, string[]>,
        action?: 'REFRESH',
    ) {
        super(message, cause, fields, action);
    }
}
