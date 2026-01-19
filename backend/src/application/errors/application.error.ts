export type ApplicationErrorCode =
    | 'AUTHENTICATION_ERROR'
    | 'AUTHORIZATION_ERROR'
    | 'BUSINESS_RULE_ERROR'
    | 'RESOURCE_NOT_FOUND_ERROR';

export type ApplicationErrorOptions = {
    message?: string;
    cause?: unknown;
};

export abstract class ApplicationError<C extends ApplicationErrorCode> extends Error {
    protected constructor(
        public readonly code: C,
        defaultMessage: string,
        options?: ApplicationErrorOptions,
    ) {
        super(options?.message ?? defaultMessage, { cause: options?.cause });
        this.name = this.constructor.name;
    }
}
