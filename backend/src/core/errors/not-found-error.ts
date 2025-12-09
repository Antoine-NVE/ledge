import { AppError } from './app-error';

export class NotFoundError extends AppError {
    constructor(
        message: string = 'Not found',
        cause?: unknown,
        fields?: Record<string, string[]>,
        action?: 'REFRESH',
    ) {
        super(message, cause, fields, action);
    }
}
