import { AppError } from './app-error';

export class ConflictError extends AppError {
    constructor(
        message: string = 'Conflict',
        cause?: unknown,
        fields?: Record<string, string[]>,
        action?: 'REFRESH',
    ) {
        super(message, cause, fields, action);
    }
}
