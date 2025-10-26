import { ObjectId } from 'mongodb';
import z from 'zod';

export const verifySchema = z.object({
    aud: z.string(),
    sub: z
        .string()
        .refine((val) => ObjectId.isValid(val))
        .transform((val) => new ObjectId(val)),
    iat: z.number(),
    exp: z.number(),
});
