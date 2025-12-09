import { AppError } from './app-error';

export class ForbiddenError extends AppError {
    constructor(
        message: string = 'Forbidden',
        cause?: unknown,
        fields?: Record<string, string[]>,
        action?: 'REFRESH',
    ) {
        super(message, cause, fields, action);
    }
}
