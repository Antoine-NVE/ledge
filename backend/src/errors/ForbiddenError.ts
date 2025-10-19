import { HttpError } from './HttpError';

export abstract class ForbiddenError extends HttpError {
    constructor(message: string) {
        super(message, 403);
    }
}

export class TransactionAccessForbiddenError extends ForbiddenError {
    constructor() {
        super('You do not have permission to access this transaction');
    }
}
