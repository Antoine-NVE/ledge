import { PresentationError, type PresentationErrorOptions } from './presentation.error.js';
import type { $ZodErrorTree } from 'zod/v4/core';

export class ValidationError<T> extends PresentationError {
    constructor(
        public readonly tree: $ZodErrorTree<T>,
        options?: PresentationErrorOptions,
    ) {
        super('Validation error', options);
    }
}
