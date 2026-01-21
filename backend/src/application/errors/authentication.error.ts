import { ApplicationError } from './application.error.js';

export class AuthenticationError extends ApplicationError<'AUTHENTICATION_ERROR'> {
    constructor(options?: ErrorOptions & { message?: string }) {
        super('AUTHENTICATION_ERROR', 'Authentication error', options);
    }
}
