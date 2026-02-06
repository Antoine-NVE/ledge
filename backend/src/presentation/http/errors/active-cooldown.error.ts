import { HttpError } from './http.error.js';

export class ActiveCooldownError extends HttpError {
    constructor() {
        super('Active cooldown', 409, { success: false, code: 'ACTIVE_COOLDOWN' });
    }
}
