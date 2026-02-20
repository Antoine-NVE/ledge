import { HttpError } from './http.error.js';

export class EmailAlreadyVerifiedError extends HttpError {
    constructor() {
        super('Email already verified', 409, { success: false, code: 'EMAIL_ALREADY_VERIFIED' });
    }
}
