import z from 'zod';
import { Env } from '../../infrastructure/types/env-type';

export const createSendVerificationEmailBodySchema = (
    allowedOrigins: Env['ALLOWED_ORIGINS'],
) => {
    return z.object({
        frontendBaseUrl: z.url().refine((val) => allowedOrigins.includes(val)),
    });
};

export const verifyEmailBodySchema = z.object({
    jwt: z.jwt(),
});
