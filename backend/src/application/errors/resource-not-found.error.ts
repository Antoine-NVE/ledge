import { ApplicationError } from './application.error.js';

export class ResourceNotFoundError extends ApplicationError<'RESOURCE_NOT_FOUND_ERROR'> {
    constructor(options?: ErrorOptions & { message?: string }) {
        super('RESOURCE_NOT_FOUND_ERROR', 'Resource not found error', options);
    }
}
