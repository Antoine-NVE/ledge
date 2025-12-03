import { AppError } from './app-error';

export class UnauthorizedError extends AppError {
    constructor(
        message: string = 'Unauthorized',
        errors?: Record<string, string[]>,
        meta?: Record<string, unknown>,
    ) {
        super(message, errors, meta);
    }
}
