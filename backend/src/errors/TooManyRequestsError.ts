import { HttpError } from './HttpError';

export class TooManyRequestsError extends HttpError {
    constructor(message: string = 'Too many requests') {
        super(message, 429);
    }
}

export class EmailVerificationCooldownError extends TooManyRequestsError {
    constructor() {
        super('Please wait before requesting another verification email');
    }
}
