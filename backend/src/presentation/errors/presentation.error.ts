import { BaseError, type ErrorOptions } from '../../core/errors/base.error.js';

export type PresentationErrorCode = 'VALIDATION_ERROR';

export abstract class PresentationError<C extends PresentationErrorCode> extends BaseError<C> {
    protected constructor(code: C, defaultMessage: string, options?: ErrorOptions) {
        super(code, defaultMessage, options);
    }
}
