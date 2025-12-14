import { AppError, AppErrorOptions } from './app-error';

export class UnauthorizedError extends AppError {
    constructor(options?: AppErrorOptions) {
        super('Unauthorized', options);
    }
}
