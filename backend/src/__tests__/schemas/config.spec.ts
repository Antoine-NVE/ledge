import { envSchema } from '../../schemas/config';

describe('config schemas', () => {
    describe('envSchema', () => {
        const validEnv = {
            NODE_ENV: 'development',

            DATABASE_SERVICE: 'database',

            JWT_SECRET: 'your_jwt_secret',

            ALLOWED_ORIGINS: [
                'http://localhost:5173',
                'http://localhost:4173',
                'http://localhost:8000',
            ],

            SMTP_HOST: 'smtp',
            SMTP_PORT: 1025,
            SMTP_SECURE: false,
            SMTP_USER: '',
            SMTP_PASS: '',
            EMAIL_FROM: 'Ledge <no-reply@ledge.com>',
        };

        const invalidEnv = {
            NODE_ENV: 'staging',

            DATABASE_SERVICE: undefined,
            JWT_SECRET: undefined,

            ALLOWED_ORIGINS: 'not-a-url,also-not-a-url',

            SMTP_HOST: undefined,
            SMTP_PORT: 'not-a-number',
            SMTP_SECURE: 'not-a-boolean',
            SMTP_USER: undefined,
            SMTP_PASS: undefined,
            EMAIL_FROM: undefined,
        };

        it('should validate a correct environment configuration', () => {
            expect(() => envSchema.parse(validEnv)).not.toThrow();
        });

        it('should throw an error for an incorrect environment configuration', () => {
            expect(() => envSchema.parse(invalidEnv)).toThrow();
        });

        it('should throw an error if there are unknown keys', () => {
            const validEnvWithExtra = {
                ...validEnv,
                EXTRA_KEY: 'extra_value',
            };
            expect(() => envSchema.parse(validEnvWithExtra)).toThrow();
        });
    });
});
