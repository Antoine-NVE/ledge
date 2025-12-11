import { AppError, AppErrorOptions } from './app-error';

export class ConflictError extends AppError {
    constructor(options?: AppErrorOptions) {
        super('Conflict', options);
    }
}
