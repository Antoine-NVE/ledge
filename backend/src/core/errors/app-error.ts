export abstract class AppError extends Error {
    protected constructor(
        message: string,
        public fields?: Record<string, string[]>,
        public cause?: unknown,
        public action?: 'REFRESH',
        // public code?: string,
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}
