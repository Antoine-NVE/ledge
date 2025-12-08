import { AppError } from './app-error';

export class UnauthorizedError extends AppError {
    constructor(
        message: string = 'Unauthorized',
        fields?: Record<string, string[]>,
        cause?: unknown,
        action?: 'REFRESH',
    ) {
        super(message, fields, cause, action);
    }
}
