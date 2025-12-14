import { AppError, AppErrorOptions } from './app-error';

export class BadRequestError extends AppError {
    constructor(options?: AppErrorOptions) {
        super('Bad request', options);
    }
}
