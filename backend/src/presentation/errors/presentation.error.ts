export type PresentationErrorOptions = {
    message?: string;
    cause?: unknown;
};

export abstract class PresentationError extends Error {
    protected constructor(defaultMessage: string, options?: PresentationErrorOptions) {
        super(options?.message ?? defaultMessage, { cause: options?.cause });
        this.name = this.constructor.name;
    }
}
