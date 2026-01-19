export type PresentationErrorCode = 'VALIDATION_ERROR';

export type PresentationErrorOptions = {
    message?: string;
    cause?: unknown;
};

export abstract class PresentationError<C extends PresentationErrorCode> extends Error {
    protected constructor(
        public readonly code: C,
        defaultMessage: string,
        options?: PresentationErrorOptions,
    ) {
        super(options?.message ?? defaultMessage, { cause: options?.cause });
        this.name = this.constructor.name;
    }
}
