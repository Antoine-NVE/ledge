import { ApplicationError } from './application.error.js';
import type { ErrorOptions } from '../../core/errors/base.error.js';

export class ResourceNotFoundError extends ApplicationError<'RESOURCE_NOT_FOUND_ERROR'> {
    constructor(options?: ErrorOptions) {
        super('RESOURCE_NOT_FOUND_ERROR', 'Resource not found error', options);
    }
}
