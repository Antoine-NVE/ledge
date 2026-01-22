import { ValidationError } from '../../errors/validation.error.js';
import { treeifyError, type ZodType } from 'zod';
import type { Request } from 'express';

export function validateRequest<T>(
    req: Request,
    schema: ZodType<
        T,
        {
            body?: unknown;
            params?: unknown;
            query?: unknown;
        }
    >,
): T {
    const result = schema.safeParse(req);
    if (!result.success) throw new ValidationError(treeifyError(result.error));

    return result.data;
}
