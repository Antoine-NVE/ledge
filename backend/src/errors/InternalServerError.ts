import z from 'zod';
import { HttpError } from './HttpError';
import { FormatUtils } from '../utils/FormatUtils';

export abstract class InternalServerError extends HttpError {
    constructor(message: string, errors?: object) {
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
    constructor(errors: z.ZodError<object>) {
        super('Invalid data', FormatUtils.formatZodError(errors));
    }
}
