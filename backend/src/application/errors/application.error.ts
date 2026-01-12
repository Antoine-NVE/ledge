export type ApplicationErrorOptions = {
    message?: string;
    cause?: unknown;
};

export abstract class ApplicationError extends Error {
    protected constructor(defaultMessage: string, { message, cause }: ApplicationErrorOptions = {}) {
        super(message ?? defaultMessage, { cause });
        this.name = this.constructor.name;
    }
}
