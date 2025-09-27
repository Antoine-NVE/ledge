import { HttpError } from './HttpError';

export class InternalServerError extends HttpError {
    constructor(message: string) {
        super(message, 500);
    }
}

export class UndefinedUserError extends InternalServerError {
    constructor() {
        super('User is undefined');
    }
}
