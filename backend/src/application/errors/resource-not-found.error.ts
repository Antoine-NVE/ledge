import { ApplicationError, type ApplicationErrorOptions } from './application.error.js';

export class ResourceNotFoundError extends ApplicationError<'RESOURCE_NOT_FOUND_ERROR'> {
    constructor(options?: ApplicationErrorOptions) {
        super('RESOURCE_NOT_FOUND_ERROR', 'Resource not found error', options);
    }
}
