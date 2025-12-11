import { AppError, AppErrorOptions } from './app-error';

export class TooManyRequestsError extends AppError {
    constructor(options?: AppErrorOptions) {
        super('Too many requests', options);
    }
}
