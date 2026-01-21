import { ApplicationError } from './application.error.js';

export class AuthorizationError extends ApplicationError<'AUTHORIZATION_ERROR'> {
    constructor(options?: ErrorOptions & { message?: string }) {
        super('AUTHORIZATION_ERROR', 'Authorization error', options);
    }
}
