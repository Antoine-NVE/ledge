import { PasswordService } from '../../../src/infrastructure/adapters/bcrypt-hasher';
import bcrypt from 'bcrypt';

describe('PasswordService', () => {
    let passwordService: PasswordService;

    beforeEach(() => {
        passwordService = new PasswordService();
    });

    describe('hash', () => {
        it('should return a hashed string different from input', async () => {
            const plain = 'password123';
            const hash = await passwordService.hash(plain);
            expect(hash).not.toBe(plain);
        });

        it('should generate different hashes for same input', async () => {
            const plain = 'password123';
            const hash1 = await passwordService.hash(plain);
            const hash2 = await passwordService.hash(plain);
            expect(hash1).not.toBe(hash2);
        });

        it('should generate a hash with bcrypt format', async () => {
            const plain = 'password123';
            const hash = await passwordService.hash(plain);
            expect(hash).toMatch(/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/);
        });
    });

    describe('compare', () => {
        it('should return true for matching plain and hash', async () => {
            const plain = 'password123';
            const hash = await bcrypt.hash(plain, 10);
            const result = await passwordService.compare(plain, hash);
            expect(result).toBe(true);
        });

        it('should return false for non-matching plain and hash', async () => {
            const plain = 'password123';
            const hash = await bcrypt.hash(plain, 10);
            const result = await passwordService.compare('wrongpassword', hash);
            expect(result).toBe(false);
        });

        it('should return false when comparing to a hash of a different password', async () => {
            const hashOfOther = await bcrypt.hash('otherpassword', 10);
            const result = await passwordService.compare(
                'password123',
                hashOfOther,
            );
            expect(result).toBe(false);
        });
    });
});
