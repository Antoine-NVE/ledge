import { HttpError } from './HttpError';

class TooManyRequestsError extends HttpError {
    constructor(message: string) {
        super(message, 429);
    }
}

export class EmailVerificationCooldownError extends TooManyRequestsError {
    constructor() {
        super('Please wait before requesting another verification email');
    }
}
