import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import { BadRequestError } from '../../../../infrastructure/errors/bad-request-error';
import { formatError } from '../../../../infrastructure/utils/schema-utils';

export const validate =
    (schema: z.ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        const { success, data, error } = schema.safeParse(req.body);

        if (!success) {
            throw new BadRequestError('Validation error', formatError(error));
        }

        req.body = data;
        next();
    };
