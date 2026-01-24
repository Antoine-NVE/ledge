import { BaseError } from '../../core/errors/base.error.js';
import type { PresentationErrorCode } from '@shared/api/api-response.js';

export abstract class PresentationError<C extends PresentationErrorCode> extends BaseError<C> {
    protected constructor(code: C, defaultMessage: string, options?: ErrorOptions & { message?: string }) {
        super(code, defaultMessage, options);
    }
}
