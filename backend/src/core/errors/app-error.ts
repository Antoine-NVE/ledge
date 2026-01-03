type Action = 'LOGIN' | 'REFRESH';

export type AppErrorOptions = {
    message?: string;
    cause?: unknown;
    action?: Action;
};

export abstract class AppError extends Error {
    public readonly action?: Action;

    protected constructor(
        defaultMessage: string,
        public readonly statusCode: number,
        public readonly code: string,
        { message, cause, action }: AppErrorOptions = {},
    ) {
        super(message ?? defaultMessage, { cause });
        this.name = this.constructor.name;

        if (action) this.action = action;
    }
}
