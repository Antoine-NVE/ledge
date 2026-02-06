import { HttpError } from './http.error.js';

export class DuplicateEmailError extends HttpError {
    constructor() {
        super('Duplicate email', 409, { success: false, code: 'DUPLICATE_EMAIL' });
    }
}
