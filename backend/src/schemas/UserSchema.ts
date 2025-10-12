import { ObjectId } from 'mongodb';
import z from 'zod';
import { env } from '../config/env';

export class UserSchema {
    constructor(private allowedOrigins: string[]) {}

    base = z
        .object({
            _id: z.custom<ObjectId>((val) => val instanceof ObjectId),
            email: z
                .string()
                .trim()
                .min(1, 'Email is required')
                .toLowerCase()
                .email('Invalid email address'),
            passwordHash: z.string().regex(/^\$2b\$10\$[./A-Za-z0-9]{53}$/),
            isEmailVerified: z.boolean(),
            emailVerificationCooldownExpiresAt: z.date().nullable(),
            createdAt: z.date(),
            updatedAt: z.date().nullable(),
        })
        .strict();

    authenticate = z
        .object({
            userId: z
                .string()
                .refine((val) => ObjectId.isValid(val))
                .transform((val) => new ObjectId(val)),
        })
        .strict();

    sendVerificationEmail = z
        .object({
            frontendBaseUrl: z
                .string()
                .url()
                .refine((val) => this.allowedOrigins.includes(val)),
        })
        .strict();

    verifyEmail = z
        .object({
            token: z.string().jwt(),
        })
        .strict();

    safe = this.base.omit({
        passwordHash: true,
    });
}
