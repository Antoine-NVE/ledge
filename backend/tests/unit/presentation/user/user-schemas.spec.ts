import { createSendVerificationEmailBodySchema } from '../../../src/presentation/user/user-schemas';

describe('user schemas', () => {
    const ALLOWED_ORIGINS = ['https://mock-dev', 'https://mock-prod'];

    describe('sendVerificationEmailBodySchema', () => {
        it('should reject a URL not in ALLOWED_ORIGINS', () => {
            const result = createSendVerificationEmailBodySchema(
                ALLOWED_ORIGINS,
            ).safeParse({
                frontendBaseUrl: 'https://evil.com',
            });

            expect(result.success).toBe(false);
        });

        it('should accept a URL inside ALLOWED_ORIGINS', () => {
            const result = createSendVerificationEmailBodySchema(
                ALLOWED_ORIGINS,
            ).safeParse({
                frontendBaseUrl: 'https://mock-dev',
            });

            expect(result.success).toBe(true);
        });
    });
});
