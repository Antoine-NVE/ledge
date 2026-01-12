import { PresentationError, type PresentationErrorOptions } from './presentation.error.js';
import type { $ZodIssue } from 'zod/v4/core';

export class ValidationError extends PresentationError {
    constructor(
        public readonly issues: $ZodIssue[],
        options?: PresentationErrorOptions,
    ) {
        super('Validation error', options);
    }
}
