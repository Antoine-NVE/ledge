import { HttpError } from './http-error';

export class UnauthorizedError extends HttpError {
    constructor(
        message: string = 'Unauthorized',
        errors?: Record<string, string[]>,
        meta?: Record<string, unknown>,
    ) {
        super(message, 401, errors, meta);
    }
}
