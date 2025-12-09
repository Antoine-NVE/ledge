export abstract class AppError extends Error {
    protected constructor(
        message: string,
        public cause?: unknown, // I think cause is supported by default in newer versions of TS
        public fields?: Record<string, string[]>,
        public action?: 'REFRESH',
        // public code?: string,
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}
