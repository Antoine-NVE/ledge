export type PresentationErrorOptions = {
    message?: string;
    cause?: unknown;
};

export abstract class PresentationError extends Error {
    protected constructor(defaultMessage: string, { message, cause }: PresentationErrorOptions = {}) {
        super(message ?? defaultMessage, { cause });
        this.name = this.constructor.name;
    }
}
