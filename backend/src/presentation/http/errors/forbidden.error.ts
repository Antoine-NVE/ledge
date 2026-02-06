import { HttpError } from './http.error.js';

export class ForbiddenError extends HttpError {
    constructor() {
        super('Forbidden', 403, { success: false, code: 'FORBIDDEN' });
    }
}
