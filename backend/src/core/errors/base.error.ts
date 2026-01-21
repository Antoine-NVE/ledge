export type ErrorOptions = {
    message?: string;
    cause?: unknown;
};

export abstract class BaseError<C extends string> extends Error {
    protected constructor(
        public readonly code: C,
        defaultMessage: string,
        options?: ErrorOptions,
    ) {
        super(options?.message ?? defaultMessage, { cause: options?.cause });
        this.name = this.constructor.name;
    }
}
