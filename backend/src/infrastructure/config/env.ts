import z from 'zod';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';
import { ensureError } from '../../core/utils/error.js';

export const loadEnv = (): Result<z.infer<typeof schema>, Error> => {
    const schema = z.object({
        nodeEnv: z.enum(['development', 'production']),
        tokenSecret: z.string(),
        allowedOrigins: z
            .string()
            .transform((value) => value.split(','))
            .pipe(z.array(z.url())),
        port: z.coerce.number(),
        mongoUrl: z.url(),
        redisUrl: z.url(),
        smtpUrl: z.url(),
        emailFrom: z.string(),
        lokiUrl: z.url(),
    });

    try {
        const parsed = schema.parse({
            nodeEnv: process.env.NODE_ENV,
            tokenSecret: process.env.TOKEN_SECRET,
            allowedOrigins: process.env.ALLOWED_ORIGINS,
            port: process.env.PORT,
            mongoUrl: process.env.MONGO_URL,
            redisUrl: process.env.REDIS_URL,
            smtpUrl: process.env.SMTP_URL,
            emailFrom: process.env.EMAIL_FROM,
            lokiUrl: process.env.LOKI_URL,
        });

        return ok(parsed);
    } catch (err: unknown) {
        return fail(ensureError(err));
    }
};
