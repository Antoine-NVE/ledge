type Action = 'LOGIN' | 'REFRESH';

export type AppErrorOptions = {
    message?: string;
    fields?: Record<string, string[]>;
    cause?: unknown;
    action?: Action;
};

export abstract class AppError extends Error {
    public readonly fields?: Record<string, string[]>;
    public readonly action?: Action;

    protected constructor(
        defaultMessage: string,
        public readonly statusCode: number,
        public readonly code: string,
        { message, fields, cause, action }: AppErrorOptions = {},
    ) {
        super(message ?? defaultMessage, { cause });
        this.name = this.constructor.name;

        if (fields && Object.keys(fields).length > 0) this.fields = fields;
        if (action) this.action = action;
    }
}
