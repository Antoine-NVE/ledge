import type { ApiError } from '@shared/api/api-response.js';

export abstract class HttpError extends Error {
    protected constructor(
        message: string,
        public readonly status: number,
        public readonly body: ApiError,
    ) {
        super(message);
        this.name = new.target.name;
    }
}
