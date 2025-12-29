import z from 'zod';
import { parseArray, parseNumber } from '../../core/utils/parse.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';
import { ensureError } from '../../core/utils/error.js';

type Output = z.infer<typeof envSchema>;

const envSchema = z.object({
    nodeEnv: z.enum(['development', 'production']),
    tokenSecret: z.string(),
    allowedOrigins: z.array(z.url()),
    port: z.number(),
    mongoUrl: z.url(),
    redisUrl: z.url(),
    smtpUrl: z.url(),
    emailFrom: z.string(),
    lokiUrl: z.url(),
});

export const loadEnv = (): Result<Output, Error> => {
    try {
        return ok(
            envSchema.parse({
                nodeEnv: process.env.NODE_ENV,
                tokenSecret: process.env.TOKEN_SECRET,
                allowedOrigins: parseArray(process.env.ALLOWED_ORIGINS),
                port: parseNumber(process.env.PORT),
                mongoUrl: process.env.MONGO_URL,
                redisUrl: process.env.REDIS_URL,
                smtpUrl: process.env.SMTP_URL,
                emailFrom: process.env.EMAIL_FROM,
                lokiUrl: process.env.LOKI_URL,
            }),
        );
    } catch (err: unknown) {
        return fail(ensureError(err));
    }
};
