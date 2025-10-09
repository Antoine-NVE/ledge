import { ObjectId } from 'mongodb';
import z from 'zod';

export const userSchema = z
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

export const sendVerificationEmailInputSchema = z
    .object({
        frontendBaseUrl: z.string().url(),
    })
    .strict();

export const verifyEmailInputSchema = z
    .object({
        token: z.string().jwt(),
    })
    .strict();

export const userOuputSchema = userSchema.omit({
    passwordHash: true,
});
