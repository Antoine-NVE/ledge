import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import { BadRequestError } from '../../../../../core/errors/bad-request-error';
import { formatZodError } from '../../../../../core/utils/format';

export const createValidateBody = ({ schema }: { schema: z.ZodSchema }) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { success, data, error } = schema.safeParse(req.body);

        if (!success) {
            throw new BadRequestError(
                'Validation error',
                formatZodError(error),
            );
        }

        // Can be useful if data is updated by schema
        req.body = data;
        next();
    };
};
