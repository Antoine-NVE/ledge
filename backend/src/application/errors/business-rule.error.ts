import { ApplicationError } from './application.error.js';
import type { BusinessRuleErrorReason } from '@shared/api/api-response.js';

export class BusinessRuleError extends ApplicationError<'BUSINESS_RULE_ERROR'> {
    constructor(
        public readonly reason: BusinessRuleErrorReason,
        options?: ErrorOptions & { message?: string },
    ) {
        super('BUSINESS_RULE_ERROR', 'Business rule error', options);
    }
}
