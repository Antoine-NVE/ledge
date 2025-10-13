import dotenv from 'dotenv';
import { ConfigSchema } from '../schemas/ConfigSchema';
import { parseArray, parseBoolean, parseNumber } from '../utils/parse';

dotenv.config();

const configSchema = new ConfigSchema();

export const env = configSchema.parseEnv({
    NODE_ENV: process.env.NODE_ENV,

    DATABASE_SERVICE: process.env.DATABASE_SERVICE,

    JWT_SECRET: process.env.JWT_SECRET,

    ALLOWED_ORIGINS: parseArray(process.env.ALLOWED_ORIGINS),

    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: parseNumber(process.env.SMTP_PORT),
    SMTP_SECURE: parseBoolean(process.env.SMTP_SECURE),
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM,
});
