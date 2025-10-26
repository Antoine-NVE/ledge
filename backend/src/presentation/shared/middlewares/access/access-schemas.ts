import { ObjectId } from 'mongodb';
import z from 'zod';

export const authorizeParamsSchema = z.object({
    id: z
        .string()
        .refine((val) => ObjectId.isValid(val))
        .transform((val) => new ObjectId(val)),
});
