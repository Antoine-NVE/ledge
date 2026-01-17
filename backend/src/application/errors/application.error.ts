export type ApplicationErrorOptions = {
    message?: string;
    cause?: unknown;
};

export abstract class ApplicationError extends Error {
    protected constructor(defaultMessage: string, options?: ApplicationErrorOptions) {
        super(options?.message ?? defaultMessage, { cause: options?.cause });
        this.name = this.constructor.name;
    }
}
