import { PasswordService } from '../../services/PasswordService';
import bcrypt from 'bcrypt';

describe('PasswordService', () => {
    let passwordService: PasswordService;

    beforeEach(() => {
        jest.clearAllMocks();

        passwordService = new PasswordService();
    });

    describe('hash', () => {
        it('should return a hashed password', async () => {
            const data = await passwordService.hash('Azerty123!');
            expect(data).toHaveLength(60);
        });
    });

    describe('compare', () => {
        it('should return true with a valid password', async () => {
            const password = 'Azerty123!';
            const passwordHash = await bcrypt.hash(password, 10);
            const doesMatch = await passwordService.compare(
                password,
                passwordHash,
            );

            expect(doesMatch).toBe(true);
        });

        it('should return false with an invalid password', async () => {
            const password = 'Azerty123!';
            const passwordHash = await bcrypt.hash(password, 10);
            const doesMatch = await passwordService.compare(
                '123Azerty!',
                passwordHash,
            );

            expect(doesMatch).toBe(false);
        });
    });
});
