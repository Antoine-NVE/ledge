import { ApplicationError } from './application.error.js';
import type { ErrorOptions } from '../../core/errors/base.error.js';

export class AuthenticationError extends ApplicationError<'AUTHENTICATION_ERROR'> {
    constructor(options?: ErrorOptions) {
        super('AUTHENTICATION_ERROR', 'Authentication error', options);
    }
}
