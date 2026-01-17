import { ApplicationError, type ApplicationErrorOptions } from './application.error.js';

type Reason = 'EMAIL_ALREADY_VERIFIED' | 'ACTIVE_COOLDOWN' | 'INVALID_TOKEN' | 'DUPLICATE_EMAIL';

export class BusinessRuleError extends ApplicationError {
    constructor(
        public readonly reason: Reason,
        options?: ApplicationErrorOptions,
    ) {
        super('Business rule error', options);
    }
}
