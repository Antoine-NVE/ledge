import { HttpError } from './HttpError';

export class ConflictError extends HttpError {
    constructor(
        message: string = 'Conflict',
        errors?: Record<string, string[]>,
        meta?: Record<string, unknown>,
    ) {
        super(message, 409, errors, meta);
    }
}
