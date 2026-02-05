import { HttpError } from './http.error.js';
import type { $ZodErrorTree } from 'zod/v4/core';

export class BadRequestError<E> extends HttpError {
    constructor(tree: $ZodErrorTree<E>) {
        super('Bad request', 400, { success: false, code: 'BAD_REQUEST', tree });
    }
}
