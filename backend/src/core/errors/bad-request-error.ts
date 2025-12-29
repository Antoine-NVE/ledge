import { AppError, type AppErrorOptions } from './app-error.js';

export class BadRequestError extends AppError {
    constructor(options?: AppErrorOptions) {
        super('Bad request', 400, 'BAD_REQUEST', options);
    }
}
