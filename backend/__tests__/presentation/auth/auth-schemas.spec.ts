import { registerBodySchema } from '../../../src/presentation/auth/auth-schemas';

describe('Auth schemas', () => {
    describe('registerBodySchema', () => {
        let validBody: object;

        beforeAll(async () => {
            validBody = {
                email: 'test@example.com',
                password: 'Azerty123!',
                confirmPassword: 'Azerty123!',
            };
        });

        it('should accept valid body', () => {
            const { success } = registerBodySchema.safeParse(validBody);

            expect(success).toBe(true);
        });

        it('should not accept invalid body', () => {
            let password = ' Azerty123!'; // Whitespace

            let data = registerBodySchema.safeParse({
                ...validBody,
                password: password,
                confirmPassword: password,
            });

            expect(data.success).toBe(false);

            password = 'hello'; // Not strong enough

            data = registerBodySchema.safeParse({
                ...validBody,
                password: password,
                confirmPassword: password,
            });

            expect(data.success).toBe(false);
        });

        it('should not accept different passwords', () => {
            const { success } = registerBodySchema.safeParse({
                ...validBody,
                confirmPassword: '!123Azerty',
            });

            expect(success).toBe(false);
        });
    });
});
