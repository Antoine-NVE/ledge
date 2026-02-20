import type { Request } from 'express';
import type { ZodType } from 'zod';
import { treeifyError } from 'zod';
import { BadRequestError } from '../errors/bad-request.error.js';

export const validateOrThrow = <T>(req: Request, schema: ZodType<T>): T => {
    const result = schema.safeParse(req);
    if (!result.success) throw new BadRequestError(treeifyError(result.error));
    return result.data;
};
