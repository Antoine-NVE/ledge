import { AppError, type AppErrorOptions } from './app-error.js';

export class UnauthorizedError extends AppError {
    constructor(options?: AppErrorOptions) {
        super('Unauthorized', 401, 'UNAUTHORIZED', options);
    }
}
