import { HttpError } from './http-error';

export class ForbiddenError extends HttpError {
    constructor(
        message: string = 'Forbidden',
        errors?: Record<string, string[]>,
        meta?: Record<string, unknown>,
    ) {
        super(message, 403, errors, meta);
    }
}
