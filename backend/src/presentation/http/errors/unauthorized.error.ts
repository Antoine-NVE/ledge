import { HttpError } from './http.error.js';

export class UnauthorizedError extends HttpError {
    constructor() {
        super('Unauthorized', 401, { success: false, code: 'UNAUTHORIZED' });
    }
}
