import { HttpError } from './http.error.js';

export class InvalidCredentialsError extends HttpError {
    constructor() {
        super('Invalid credentials', 401, { success: false, code: 'INVALID_CREDENTIALS' });
    }
}
