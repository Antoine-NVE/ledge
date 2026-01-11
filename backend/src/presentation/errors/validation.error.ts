import { PresentationError } from './presentation.error.js';
import type { $ZodIssue } from 'zod/v4/core';

export class ValidationError extends PresentationError {
    constructor(public readonly issues: $ZodIssue[]) {
        super();
    }
}
