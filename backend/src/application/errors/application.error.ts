import { BaseError, type ErrorOptions } from '../../core/errors/base.error.js';

export type ApplicationErrorCode =
    | 'AUTHENTICATION_ERROR'
    | 'AUTHORIZATION_ERROR'
    | 'BUSINESS_RULE_ERROR'
    | 'RESOURCE_NOT_FOUND_ERROR';

export abstract class ApplicationError<C extends ApplicationErrorCode> extends BaseError<C> {
    protected constructor(code: C, defaultMessage: string, options?: ErrorOptions) {
        super(code, defaultMessage, options);
    }
}
