import { ApplicationError, type ApplicationErrorOptions } from './application.error.js';

export class AuthenticationError extends ApplicationError {
    constructor(options?: ApplicationErrorOptions) {
        super('Authentication error', options);
    }
}
