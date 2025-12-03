export abstract class AppError extends Error {
    protected constructor(
        message: string,
        public errors?: Record<string, string[]>,
        public meta?: Record<string, unknown>,
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}
