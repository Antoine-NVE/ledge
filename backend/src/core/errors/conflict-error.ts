import { AppError } from './app-error';

export class ConflictError extends AppError {
    constructor(
        message: string = 'Conflict',
        fields?: Record<string, string[]>,
        cause?: unknown,
        action?: 'REFRESH',
    ) {
        super(message, fields, cause, action);
    }
}
