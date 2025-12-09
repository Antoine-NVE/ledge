import { AppError } from './app-error';

export class UnauthorizedError extends AppError {
    constructor(
        message: string = 'Unauthorized',
        cause?: unknown,
        fields?: Record<string, string[]>,
        action?: 'REFRESH',
    ) {
        super(message, cause, fields, action);
    }
}
