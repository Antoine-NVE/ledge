import { AppError } from './app-error';

export class ConflictError extends AppError {
    constructor(
        message: string = 'Conflict',
        errors?: Record<string, string[]>,
        meta?: Record<string, unknown>,
    ) {
        super(message, errors, meta);
    }
}
