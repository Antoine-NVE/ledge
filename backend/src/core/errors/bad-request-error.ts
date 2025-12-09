import { AppError } from './app-error';

export class BadRequestError extends AppError {
    constructor(
        message = 'Bad request',
        cause?: unknown,
        fields?: Record<string, string[]>,
        action?: 'REFRESH',
    ) {
        super(message, cause, fields, action);
    }
}
