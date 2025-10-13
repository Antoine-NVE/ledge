export abstract class HttpError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public errors?: Record<string, string[]>,
        public action?: string,
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}
