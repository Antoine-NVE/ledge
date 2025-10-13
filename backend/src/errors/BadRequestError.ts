import z from 'zod';
import { HttpError } from './HttpError';

export abstract class BadRequestError extends HttpError {
    constructor(message: string, errors?: Record<string, string[]>) {
        super(message, 400, errors);
    }
}

export class ValidationError extends BadRequestError {
    constructor(errors: Record<string, string[]>) {
        super('Validation error', errors);
    }
}
