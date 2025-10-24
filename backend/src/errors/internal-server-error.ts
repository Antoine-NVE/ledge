import { HttpError } from './http-error';

export class InternalServerError extends HttpError {
    constructor(
        message: string = 'Internal server error',
        errors?: Record<string, string[]>,
        meta?: Record<string, unknown>,
    ) {
        super(message, 500, errors, meta);
    }
}
