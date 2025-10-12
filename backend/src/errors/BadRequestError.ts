import { HttpError } from './HttpError';

export abstract class BadRequestError extends HttpError {
    constructor(message: string, errors?: object) {
        super(message, 400, errors);
    }
}

export class ValidationError extends BadRequestError {
    constructor(errors: object) {
        super('Validation error', errors);
    }
}
