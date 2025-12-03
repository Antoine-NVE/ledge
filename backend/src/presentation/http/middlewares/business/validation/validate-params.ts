import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import { formatZodError } from '../../../../../infrastructure/utils/format';
import { BadRequestError } from '../../../../../core/errors/bad-request-error';

export const createValidateParams = ({ schema }: { schema: z.ZodSchema }) => {
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
