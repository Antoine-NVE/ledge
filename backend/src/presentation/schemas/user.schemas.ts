import z, { type ZodType } from 'zod';
import type { RequestEmailVerificationSchema } from '@shared/schemas/user/request-email-verification.schema.js';
import type { VerifyEmailSchema } from '@shared/schemas/user/verify-email.schema.js';

export const requestEmailVerificationSchema = (allowedOrigins: string[]): ZodType<RequestEmailVerificationSchema> => {
    return z.object({
        body: z.object({
            frontendBaseUrl: z.url().refine((value) => allowedOrigins.includes(value)),
        }),
    });
};

export const verifyEmailSchema = (): ZodType<VerifyEmailSchema> => {
    return z.object({
        body: z.object({
            token: z.string(),
        }),
    });
};
