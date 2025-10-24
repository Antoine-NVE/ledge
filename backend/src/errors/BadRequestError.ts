import { HttpError } from './HttpError';

export class BadRequestError extends HttpError {
    constructor(
        message: string = 'Bad request',
        errors?: Record<string, string[]>,
        meta?: Record<string, unknown>,
    ) {
        super(message, 400, errors, meta);
    }
}
