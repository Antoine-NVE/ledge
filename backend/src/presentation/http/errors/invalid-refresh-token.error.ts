import { HttpError } from './http.error.js';

export class InvalidRefreshTokenError extends HttpError {
    constructor() {
        super('Invalid refresh token', 401, { success: false, code: 'INVALID_REFRESH_TOKEN' });
    }
}
