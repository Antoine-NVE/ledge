import { AppError } from './app-error';

export class ForbiddenError extends AppError {
    constructor(
        message: string = 'Forbidden',
        errors?: Record<string, string[]>,
        meta?: Record<string, unknown>,
    ) {
        super(message, errors, meta);
    }
}
