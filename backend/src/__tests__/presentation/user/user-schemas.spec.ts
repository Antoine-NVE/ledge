import { sendVerificationEmailBodySchema } from '../../../presentation/user/user-schemas';

jest.mock('../../../infrastructure/config/env', () => ({
    env: {
        ALLOWED_ORIGINS: ['https://mock-dev', 'https://mock-prod'],
    },
}));

describe('user schemas', () => {
    describe('sendVerificationEmailBodySchema', () => {
        it('should reject a URL not in ALLOWED_ORIGINS', () => {
            const result = sendVerificationEmailBodySchema.safeParse({
                frontendBaseUrl: 'https://evil.com',
            });

            expect(result.success).toBe(false);
        });

        it('should accept a URL inside ALLOWED_ORIGINS', () => {
            const result = sendVerificationEmailBodySchema.safeParse({
                frontendBaseUrl: 'https://mock-dev',
            });

            expect(result.success).toBe(true);
        });
    });
});
