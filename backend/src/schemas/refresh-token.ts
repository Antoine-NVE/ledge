import z from 'zod';
import { ObjectId } from 'mongodb';

export const refreshTokenSchema = z.strictObject({
    _id: z.custom<ObjectId>((val) => val instanceof ObjectId),
    token: z.string().length(64),
    expiresAt: z.date(),
    userId: z.custom<ObjectId>((val) => val instanceof ObjectId),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
});
