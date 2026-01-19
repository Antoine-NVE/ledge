import { ApplicationError, type ApplicationErrorOptions } from './application.error.js';

export type BusinessRuleErrorReason =
    | 'EMAIL_ALREADY_VERIFIED'
    | 'ACTIVE_COOLDOWN'
    | 'INVALID_TOKEN'
    | 'DUPLICATE_EMAIL';

export class BusinessRuleError extends ApplicationError<'BUSINESS_RULE_ERROR'> {
    constructor(
        public readonly reason: BusinessRuleErrorReason,
        options?: ApplicationErrorOptions,
    ) {
        super('BUSINESS_RULE_ERROR', 'Business rule error', options);
    }
}
