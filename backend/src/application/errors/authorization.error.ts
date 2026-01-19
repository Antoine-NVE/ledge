import { ApplicationError, type ApplicationErrorOptions } from './application.error.js';

export class AuthorizationError extends ApplicationError<'AUTHORIZATION_ERROR'> {
    constructor(options?: ApplicationErrorOptions) {
        super('AUTHORIZATION_ERROR', 'Authorization error', options);
    }
}
