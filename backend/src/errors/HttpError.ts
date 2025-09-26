export class HttpError extends Error {
    constructor(
        message: string,
        public statusCode: number,
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}
