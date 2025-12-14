import { AppError, AppErrorOptions } from './app-error';

export class ForbiddenError extends AppError {
    constructor(options?: AppErrorOptions) {
        super('Forbidden', options);
    }
}
