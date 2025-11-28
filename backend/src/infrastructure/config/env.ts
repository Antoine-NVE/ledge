import { parseArray, parseBoolean, parseNumber } from '../utils/parse';
import z from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']),

    JWT_SECRET: z.string(),

    ALLOWED_ORIGINS: z.array(z.url()),

    SMTP_HOST: z.string(),
    SMTP_PORT: z.number(),
    SMTP_SECURE: z.boolean(),
    SMTP_USER: z.string(),
    SMTP_PASS: z.string(),
    EMAIL_FROM: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const loadEnv = () => {
    return envSchema.parse({
        NODE_ENV: process.env.NODE_ENV,

        JWT_SECRET: process.env.JWT_SECRET,

        ALLOWED_ORIGINS: parseArray(process.env.ALLOWED_ORIGINS),

        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: parseNumber(process.env.SMTP_PORT),
        SMTP_SECURE: parseBoolean(process.env.SMTP_SECURE),
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASS: process.env.SMTP_PASS,
        EMAIL_FROM: process.env.EMAIL_FROM,
    });
};
