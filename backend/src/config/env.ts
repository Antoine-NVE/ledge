import dotenv from 'dotenv';
import { envSchema } from '../schemas/configSchema';
dotenv.config();

export const env = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,

    DATABASE_SERVICE: process.env.DATABASE_SERVICE,

    JWT_SECRET: process.env.JWT_SECRET,

    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,

    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: Number(process.env.SMTP_PORT),
    SMTP_SECURE:
        process.env.SMTP_SECURE === 'true'
            ? true
            : process.env.SMTP_SECURE === 'false'
              ? false
              : undefined,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM,
});
