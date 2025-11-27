import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import { BadRequestError } from '../../../infrastructure/errors/bad-request-error';
import { formatZodError } from '../../../infrastructure/utils/format-utils';

export const createValidateParamsMiddleware = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { success, error } = schema.safeParse(req.params);

        if (!success) {
            throw new BadRequestError(
                'Invalid parameters',
                formatZodError(error),
            );
        }

        next();
    };
};
