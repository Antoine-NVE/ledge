import { HttpError } from './HttpError';

export abstract class InternalServerError extends HttpError {
    constructor(message: string, errors?: Record<string, string[]>) {
        super(message, 500, errors);
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

export class InvalidDataError extends InternalServerError {
    constructor(errors: Record<string, string[]>) {
        super('Invalid data', errors);
    }
}
