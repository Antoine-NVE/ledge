import { ApplicationError, type ApplicationErrorOptions } from './application.error.js';

export class BusinessRuleError extends ApplicationError {
    constructor(options?: ApplicationErrorOptions) {
        super('Business rule error', options);
    }
}
