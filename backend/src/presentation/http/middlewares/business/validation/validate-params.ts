import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../../../../../core/errors/bad-request-error';
import { ZodType } from 'zod';

export const createValidateParams = <T extends ZodType<Record<string, string>>>({ schema }: { schema: T }) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { success, data, error } = schema.safeParse(req.params);

        if (!success) {
            throw new BadRequestError({
                cause: error,
            });
        }

        req.params = data;
        next();
    };
};
