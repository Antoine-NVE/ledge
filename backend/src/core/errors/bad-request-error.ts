import { AppError } from './app-error';

export class BadRequestError extends AppError {
    constructor(
        message = 'Bad request',
        fields?: Record<string, string[]>,
        cause?: unknown,
        action?: 'REFRESH',
    ) {
        super(message, fields, cause, action);
    }
}
