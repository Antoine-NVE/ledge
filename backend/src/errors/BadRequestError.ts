import z from 'zod';
import { HttpError } from './HttpError';
import { FormatUtils } from '../utils/FormatUtils';

export abstract class BadRequestError extends HttpError {
    constructor(message: string, errors?: object) {
        super(message, 400, errors);
    }
}

export class ValidationError extends BadRequestError {
    constructor(errors: z.ZodError<object>) {
        super('Validation error', FormatUtils.formatZodError(errors));
    }
}
