import z from 'zod';
import { Env } from '../../infrastructure/types/env-type';

export const createSendVerificationEmailBodySchema = (env: Env) => {
    return z.object({
        frontendBaseUrl: z
            .url()
            .refine((val) => env.ALLOWED_ORIGINS.includes(val)),
    });
};

export const verifyEmailBodySchema = z.object({
    jwt: z.jwt(),
});
