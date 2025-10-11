import dotenv from 'dotenv';
import { envSchema } from '../schemas/configSchema';
import { ParseUtils } from '../utils/ParseUtils';

dotenv.config();

export const env = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,

    DATABASE_SERVICE: process.env.DATABASE_SERVICE,

    JWT_SECRET: process.env.JWT_SECRET,

    ALLOWED_ORIGINS: ParseUtils.parseArray(process.env.ALLOWED_ORIGINS),

    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: ParseUtils.parseNumber(process.env.SMTP_PORT),
    SMTP_SECURE: ParseUtils.parseBoolean(process.env.SMTP_SECURE),
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM,
});
