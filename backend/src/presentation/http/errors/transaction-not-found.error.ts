import { HttpError } from './http.error.js';

export class TransactionNotFoundError extends HttpError {
    constructor() {
        super('Transaction not found', 404, { success: false, code: 'TRANSACTION_NOT_FOUND' });
    }
}
