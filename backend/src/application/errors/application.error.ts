import { BaseError } from '../../core/errors/base.error.js';
import type { ApplicationErrorCode } from '@shared/api/api-response.js';

export abstract class ApplicationError<C extends ApplicationErrorCode> extends BaseError<C> {
    protected constructor(code: C, defaultMessage: string, options?: ErrorOptions & { message?: string }) {
        super(code, defaultMessage, options);
    }
}
