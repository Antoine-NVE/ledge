import { ApplicationError, type ApplicationErrorOptions } from './application.error.js';

export class ResourceNotFoundError extends ApplicationError {
    constructor(options?: ApplicationErrorOptions) {
        super('Resource not found error', options);
    }
}
