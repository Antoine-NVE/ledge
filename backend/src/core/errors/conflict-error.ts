import { AppError, type AppErrorOptions } from './app-error.js';

export class ConflictError extends AppError {
    constructor(options?: AppErrorOptions) {
        super('Conflict', options);
    }
}
