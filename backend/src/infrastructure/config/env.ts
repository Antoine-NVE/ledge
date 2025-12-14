import z from 'zod';
import { parseArray, parseNumber } from '../../core/utils/parse';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']),
    TOKEN_SECRET: z.string(),
    ALLOWED_ORIGINS: z.array(z.url()),
    PORT: z.number().optional(),
    DATABASE_URL: z.url(),
    CACHE_URL: z.url(),
    SMTP_URL: z.url(),
    EMAIL_FROM: z.string(),
});

export const loadEnv = () => {
    const env = envSchema.parse({
        NODE_ENV: process.env.NODE_ENV,
        TOKEN_SECRET: process.env.TOKEN_SECRET,
        ALLOWED_ORIGINS: parseArray(process.env.ALLOWED_ORIGINS),
        PORT: parseNumber(process.env.PORT),
        DATABASE_URL: process.env.DATABASE_URL,
        CACHE_URL: process.env.CACHE_URL,
        SMTP_URL: process.env.SMTP_URL,
        EMAIL_FROM: process.env.EMAIL_FROM,
    });

    return {
        nodeEnv: env.NODE_ENV,
        tokenSecret: env.TOKEN_SECRET,
        allowedOrigins: env.ALLOWED_ORIGINS,
        port: env.PORT,
        databaseUrl: env.DATABASE_URL,
        cacheUrl: env.CACHE_URL,
        smtpUrl: env.SMTP_URL,
        emailFrom: env.EMAIL_FROM,
    };
};
