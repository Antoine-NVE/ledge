import { AppError } from './app-error';

export class NotFoundError extends AppError {
    constructor(
        message: string = 'Not found',
        errors?: Record<string, string[]>,
        meta?: Record<string, unknown>,
    ) {
        super(message, errors, meta);
    }
}
