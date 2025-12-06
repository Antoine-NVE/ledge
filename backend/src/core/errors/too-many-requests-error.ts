import { AppError } from './app-error';

export class TooManyRequestsError extends AppError {
    constructor(message: string = 'Too many requests') {
        super(message);
    }
}
