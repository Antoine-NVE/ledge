import { HttpError } from './HttpError';

export abstract class InternalServerError extends HttpError {
    constructor(message: string) {
        super(message, 500);
    }
}

export class UndefinedUserError extends InternalServerError {
    constructor() {
        super('User is undefined');
    }
}

export class UndefinedTransactionError extends InternalServerError {
    constructor() {
        super('Transaction is undefined');
    }
}
