import dotenv from 'dotenv';
import { envSchema } from '../schemas/config-schemas';
import { parseSchema } from '../utils/schema-utils';
import { parseArray, parseBoolean, parseNumber } from '../utils/parse-utils';

dotenv.config();

export const env = parseSchema(envSchema, {
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
