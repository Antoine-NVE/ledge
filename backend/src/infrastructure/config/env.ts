import z from 'zod';
import { parseArray, parseBoolean, parseNumber } from '../../core/utils/parse';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']),
    TOKEN_SECRET: z.string(),
    ALLOWED_ORIGINS: z.array(z.url()),
    PORT: z.number().optional(),
    DATABASE_URL: z.url(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z.number(),
    SMTP_SECURE: z.boolean(),
    SMTP_AUTH: z.object({
        user: z.string(),
        pass: z.string(),
    }),
    EMAIL_FROM: z.string(),
});

export const loadEnv = () => {
    const env = envSchema.parse({
        NODE_ENV: process.env.NODE_ENV,
        TOKEN_SECRET: process.env.TOKEN_SECRET,
        ALLOWED_ORIGINS: parseArray(process.env.ALLOWED_ORIGINS),
        PORT: parseNumber(process.env.PORT),
        DATABASE_URL: process.env.DATABASE_URL,
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: parseNumber(process.env.SMTP_PORT),
        SMTP_SECURE: parseBoolean(process.env.SMTP_SECURE),
        SMTP_AUTH: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        EMAIL_FROM: process.env.EMAIL_FROM,
    });

    return {
        nodeEnv: env.NODE_ENV,
        tokenSecret: env.TOKEN_SECRET,
        allowedOrigins: env.ALLOWED_ORIGINS,
        port: env.PORT,
        databaseUrl: env.DATABASE_URL,
        smtpHost: env.SMTP_HOST,
        smtpPort: env.SMTP_PORT,
        smtpSecure: env.SMTP_SECURE,
        smtpAuth: env.SMTP_AUTH,
        emailFrom: env.EMAIL_FROM,
    };
};
