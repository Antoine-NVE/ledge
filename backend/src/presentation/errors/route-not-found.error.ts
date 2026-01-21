import { PresentationError } from './presentation.error.js';

export class RouteNotFoundError extends PresentationError<'ROUTE_NOT_FOUND_ERROR'> {
    constructor(options?: ErrorOptions & { message?: string }) {
        super('ROUTE_NOT_FOUND_ERROR', 'Route not found error', options);
    }
}
