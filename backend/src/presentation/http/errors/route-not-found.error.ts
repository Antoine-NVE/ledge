import { HttpError } from './http.error.js';

export class RouteNotFoundError extends HttpError {
    constructor() {
        super('Route not found', 404, { success: false, code: 'ROUTE_NOT_FOUND' });
    }
}
