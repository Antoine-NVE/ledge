import { ApplicationError, type ApplicationErrorOptions } from './application.error.js';

export class AuthenticationError extends ApplicationError<'AUTHENTICATION_ERROR'> {
    constructor(options?: ApplicationErrorOptions) {
        super('AUTHENTICATION_ERROR', 'Authentication error', options);
    }
}
