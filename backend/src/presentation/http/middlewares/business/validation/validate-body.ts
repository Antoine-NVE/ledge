import { NextFunction, Request, Response } from 'express';
import z from 'zod';

export const createValidateBody = ({ schema }: { schema: z.ZodSchema }) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Can be useful if data is updated by schema
        req.body = schema.parse(req.body);

        next();
    };
};
