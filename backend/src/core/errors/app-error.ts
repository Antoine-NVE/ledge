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

    protected constructor(
        defaultMessage: string,
        { message, fields, cause, action }: AppErrorOptions = {},
    ) {
        super(message ?? defaultMessage);
        this.name = this.constructor.name;

        if (fields) this.fields = fields;
        if (cause) this.cause = cause;
        if (action) this.action = action;
    }
}
