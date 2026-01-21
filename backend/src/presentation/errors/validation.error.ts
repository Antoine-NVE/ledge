import { PresentationError } from './presentation.error.js';
import type { $ZodErrorTree } from 'zod/v4/core';

export class ValidationError<T> extends PresentationError<'VALIDATION_ERROR'> {
    constructor(
        public readonly tree: $ZodErrorTree<T>,
        options?: ErrorOptions & { message?: string },
    ) {
        super('VALIDATION_ERROR', 'Validation error', options);
    }
}
