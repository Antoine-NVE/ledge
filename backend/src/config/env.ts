import dotenv from 'dotenv';
import { envSchema } from '../schemas/configSchema';
dotenv.config();

const parseNumber = (value: string | undefined): number | undefined => {
    if (value === undefined) return undefined;
    const number = Number(value);
    return isNaN(number) ? undefined : number;
};

const parseBoolean = (value: string | undefined): boolean | undefined => {
    if (value === undefined) return undefined;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
};

export const env = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,

    DATABASE_SERVICE: process.env.DATABASE_SERVICE,

    JWT_SECRET: process.env.JWT_SECRET,

    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,

    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: parseNumber(process.env.SMTP_PORT),
    SMTP_SECURE: parseBoolean(process.env.SMTP_SECURE),
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM,
});
