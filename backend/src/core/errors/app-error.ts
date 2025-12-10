export type AppErrorOptions = {
    message?: string;
    fields?: Record<string, string[]>;
    cause?: unknown;
    action?: 'REFRESH';
};

export abstract class AppError extends Error {
    public fields?: Record<string, string[]>;
    public cause?: unknown;
    public action?: 'REFRESH';

    protected constructor(defaultMessage: string, options?: AppErrorOptions) {
        super(options?.message ?? defaultMessage);
        this.name = this.constructor.name;

        if (options?.fields) this.fields = options.fields;
        if (options?.cause) this.cause = options.cause;
        if (options?.action) this.action = options.action;
    }
}
