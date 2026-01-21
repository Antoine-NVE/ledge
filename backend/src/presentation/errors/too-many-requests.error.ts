import { PresentationError } from './presentation.error.js';

export class TooManyRequestsError extends PresentationError<'TOO_MANY_REQUESTS_ERROR'> {
    constructor(options?: ErrorOptions & { message?: string }) {
        super('TOO_MANY_REQUESTS_ERROR', 'Too many requests error', options);
    }
}
