import { HttpError } from './http.error.js';

export class TooManyRequestsError extends HttpError {
    constructor() {
        super('Too many requests', 429, { success: false, code: 'TOO_MANY_REQUESTS' });
    }
}
