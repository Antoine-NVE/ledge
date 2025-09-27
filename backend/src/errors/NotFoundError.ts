import { HttpError } from './HttpError';

export class NotFoundError extends HttpError {
    constructor(message: string = 'Not found') {
        super(message, 404);
    }
}

export class UserNotFoundError extends NotFoundError {
    constructor() {
        super('User not found');
    }
}
