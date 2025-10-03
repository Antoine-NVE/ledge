import z from 'zod';
import { ObjectId } from 'mongodb';

export const refreshTokenSchema = z
    .object({
        token: z.string().trim().min(1),
        expiresAt: z.date(),
        userId: z.custom<ObjectId>((val) => val instanceof ObjectId),
    })
    .strict();
