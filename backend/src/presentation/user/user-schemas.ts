import z from 'zod';
import { env } from '../../infrastructure/config/env-config';

export const sendVerificationEmailBodySchema = z.object({
    frontendBaseUrl: z.url().refine((val) => env.ALLOWED_ORIGINS.includes(val)),
});

export const verifyEmailBodySchema = z.object({
    jwt: z.jwt(),
});
