import z from 'zod';

export class ConfigSchema {
    env = z.strictObject({
        NODE_ENV: z.enum(['development', 'production']),

        DATABASE_SERVICE: z.string(),

        JWT_SECRET: z.string(),

        ALLOWED_ORIGINS: z.array(z.string().url()),

        SMTP_HOST: z.string(),
        SMTP_PORT: z.number(),
        SMTP_SECURE: z.boolean(),
        SMTP_USER: z.string(),
        SMTP_PASS: z.string(),
        EMAIL_FROM: z.string(),
    });
}
