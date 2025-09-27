import { HttpError } from './HttpError';

export class TooManyRequestsError extends HttpError {
    constructor(message: string = 'Too Many Requests') {
        super(message, 429);
    }
}

export class EmailVerificationCooldownError extends TooManyRequestsError {
    constructor() {
        super('Please wait before requesting another verification email');
    }
}
