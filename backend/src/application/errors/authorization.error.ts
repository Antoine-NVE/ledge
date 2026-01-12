import { ApplicationError, type ApplicationErrorOptions } from './application.error.js';

export class AuthorizationError extends ApplicationError {
    constructor(options?: ApplicationErrorOptions) {
        super('Authorization error', options);
    }
}
