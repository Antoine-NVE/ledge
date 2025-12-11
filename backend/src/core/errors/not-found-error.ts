import { AppError, AppErrorOptions } from './app-error';

export class NotFoundError extends AppError {
    constructor(options?: AppErrorOptions) {
        super('Not found', options);
    }
}
