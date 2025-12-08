import { AppError } from './app-error';

export class ForbiddenError extends AppError {
    constructor(
        message: string = 'Forbidden',
        fields?: Record<string, string[]>,
        cause?: unknown,
        action?: 'REFRESH',
    ) {
        super(message, fields, cause, action);
    }
}
