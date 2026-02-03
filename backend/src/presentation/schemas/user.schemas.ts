import z, { type ZodType } from 'zod';
import type { RequestEmailVerificationSchema } from '@shared/schemas/user/request-email-verification.schema.js';
import type { VerifyEmailSchema } from '@shared/schemas/user/verify-email.schema.js';
import type { MeSchema } from '@shared/schemas/user/me.schema.js';

export const requestEmailVerificationSchema = (allowedOrigins: string[]): ZodType<RequestEmailVerificationSchema> => {
    return z.object({
        body: z.object({
            frontendBaseUrl: z.url().refine((value) => allowedOrigins.includes(value)),
        }),
        cookies: z.object({
            accessToken: z.string().optional(),
        }),
    });
};

export const verifyEmailSchema = (): ZodType<VerifyEmailSchema> => {
    return z.object({
        body: z.object({
            emailVerificationToken: z.string(),
        }),
    });
};

export const meSchema = (): ZodType<MeSchema> => {
    return z.object({
        cookies: z.object({
            accessToken: z.string().optional(),
        }),
    });
};
