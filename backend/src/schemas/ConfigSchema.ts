import z, { flattenError } from 'zod';
import { InvalidDataError } from '../errors/InternalServerError';

export class ConfigSchema {
    private env = z.strictObject({
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

    parseEnv = (data: unknown) => {
        const result = this.env.safeParse(data);
        if (!result.success) throw new InvalidDataError(flattenError(result.error));
        return result.data;
    };
}
