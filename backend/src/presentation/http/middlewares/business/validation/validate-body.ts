import type { NextFunction, Request, Response } from 'express';
import z from 'zod';
import { BadRequestError } from '../../../../../core/errors/bad-request-error.js';

export const createValidateBody = ({ schema }: { schema: z.ZodSchema }) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { success, data, error } = schema.safeParse(req.body);

        if (!success) {
            throw new BadRequestError({
                fields: z.flattenError(error).fieldErrors,
                cause: error,
            });
        }

        req.body = data;
        next();
    };
};
