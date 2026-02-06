import { HttpError } from './http.error.js';

export class InvalidTokenError extends HttpError {
    constructor() {
        super('Invalid token', 400, { success: false, code: 'INVALID_TOKEN' });
    }
}
