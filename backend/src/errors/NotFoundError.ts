import { HttpError } from './HttpError';

class NotFoundError extends HttpError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class UserNotFoundError extends NotFoundError {
    constructor() {
        super('User not found');
    }
}
