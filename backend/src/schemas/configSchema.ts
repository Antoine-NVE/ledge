import z from 'zod';

export const envSchema = z
    .object({
        NODE_ENV: z.enum(['development', 'production']),

        DATABASE_SERVICE: z.string().min(1),

        JWT_SECRET: z.string().min(1),

        ALLOWED_ORIGINS: z.string().min(1),

        SMTP_HOST: z.string().min(1),
        SMTP_PORT: z.number().min(1),
        SMTP_SECURE: z.boolean(),
        SMTP_USER: z.string(),
        SMTP_PASS: z.string(),
        EMAIL_FROM: z.string().min(1),
    })
    .strict();
