import { AppError, type AppErrorOptions } from './app-error.js';

export class NotFoundError extends AppError {
    constructor(options?: AppErrorOptions) {
        super('Not found', options);
    }
}
