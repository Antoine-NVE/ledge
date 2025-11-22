import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import { BadRequestError } from '../../../../infrastructure/errors/bad-request-error';
import { formatZodError } from '../../../../infrastructure/utils/format-utils';

export const createValidateBodyMiddleware = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { success, data, error } = schema.safeParse(req.body);

        if (!success) {
            throw new BadRequestError(
                'Validation error',
                formatZodError(error),
            );
        }

        req.body = data;
        next();
    };
};
