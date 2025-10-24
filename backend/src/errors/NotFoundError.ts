import { HttpError } from './HttpError';

export class NotFoundError extends HttpError {
    constructor(
        message: string = 'Not found',
        errors?: Record<string, string[]>,
        meta?: Record<string, unknown>,
    ) {
        super(message, 404, errors, meta);
    }
}
