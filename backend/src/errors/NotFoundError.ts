import { HttpError } from './HttpError';

export abstract class NotFoundError extends HttpError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class UserNotFoundError extends NotFoundError {
    constructor() {
        super('User not found');
    }
}

export class TransactionNotFoundError extends NotFoundError {
    constructor() {
        super('Transaction not found');
    }
}
