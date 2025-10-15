import { PasswordService } from '../../services/PasswordService';

describe('PasswordService', () => {
    let passwordService: PasswordService;

    beforeEach(() => {
        passwordService = new PasswordService();
    });

    describe('hash()', () => {
        it('should hash a plain password', async () => {
            const plainPassword = 'mySecretPassword';
            const hashedPassword = await passwordService.hash(plainPassword);

            expect(hashedPassword).toBeDefined();
            expect(hashedPassword).not.toEqual(plainPassword);
            expect(hashedPassword.length).toBeGreaterThan(0);
        });
    });

    describe('compare()', () => {
        it('should return true for matching passwords', async () => {
            const plainPassword = 'mySecretPassword';
            const hashedPassword = await passwordService.hash(plainPassword);

            const isMatch = await passwordService.compare(
                plainPassword,
                hashedPassword,
            );
            expect(isMatch).toBe(true);
        });

        it('should return false for non-matching passwords', async () => {
            const plainPassword = 'mySecretPassword';
            const wrongPassword = 'wrongPassword';
            const hashedPassword = await passwordService.hash(plainPassword);

            const isMatch = await passwordService.compare(
                wrongPassword,
                hashedPassword,
            );
            expect(isMatch).toBe(false);
        });
    });
});
