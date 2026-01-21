import { ApplicationError } from './application.error.js';
import type { ErrorOptions } from '../../core/errors/base.error.js';

export class AuthorizationError extends ApplicationError<'AUTHORIZATION_ERROR'> {
    constructor(options?: ErrorOptions) {
        super('AUTHORIZATION_ERROR', 'Authorization error', options);
    }
}
