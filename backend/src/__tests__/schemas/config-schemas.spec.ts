import { envSchema } from '../../infrastructure/schemas/config-schemas';

describe('config schemas', () => {
    describe('envSchema', () => {
        const validData = {
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

        const validDataWithExtraKey = {
            ...validData,
            extraKey: 'extra value',
        };

        it('should accept valid data', () => {
            const data = envSchema.parse(validData);
            expect(data).toEqual(validData);
        });

        it('should refuse extra key', () => {
            expect(() => envSchema.parse(validDataWithExtraKey)).toThrow();
        });
    });
});
