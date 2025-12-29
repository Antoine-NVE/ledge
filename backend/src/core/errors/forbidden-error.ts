import { AppError, type AppErrorOptions } from './app-error.js';

export class ForbiddenError extends AppError {
    constructor(options?: AppErrorOptions) {
        super('Forbidden', 403, 'FORBIDDEN', options);
    }
}
