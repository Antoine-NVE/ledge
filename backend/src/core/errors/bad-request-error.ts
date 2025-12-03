import { AppError } from './app-error';

export class BadRequestError extends AppError {
    constructor(
        message: string = 'Bad request',
        errors?: Record<string, string[]>,
        meta?: Record<string, unknown>,
    ) {
        super(message, errors, meta);
    }
}
