import { NextFunction, Request, Response } from 'express';
import z from 'zod';
export const createValidateParams = ({ schema }: { schema: z.ZodSchema }) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Only here to validate for the next modules
        schema.parse(req.params);

        next();
    };
};
