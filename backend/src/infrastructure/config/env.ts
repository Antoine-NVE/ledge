import z from 'zod';
import { parseArray, parseNumber } from '../../core/utils/parse';

const envSchema = z.object({
    nodeEnv: z.enum(['development', 'production']),
    tokenSecret: z.string(),
    allowedOrigins: z.array(z.url()),
    port: z.number().optional(),
    databaseUrl: z.url(),
    cacheUrl: z.url(),
    smtpUrl: z.url(),
    emailFrom: z.string(),
});

export const loadEnv = () => {
    return envSchema.parse({
        nodeEnv: process.env.NODE_ENV,
        tokenSecret: process.env.TOKEN_SECRET,
        allowedOrigins: parseArray(process.env.ALLOWED_ORIGINS),
        port: parseNumber(process.env.PORT),
        databaseUrl: process.env.DATABASE_URL,
        cacheUrl: process.env.CACHE_URL,
        smtpUrl: process.env.SMTP_URL,
        emailFrom: process.env.EMAIL_FROM,
    });
};
