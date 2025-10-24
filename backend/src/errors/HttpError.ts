export abstract class HttpError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public errors?: Record<string, string[]>,
        public meta?: Record<string, unknown>,
    ) {
        super(message);
        this.name = new.target.name;
    }
}
