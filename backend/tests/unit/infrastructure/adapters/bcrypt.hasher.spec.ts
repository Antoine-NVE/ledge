import { describe, expect, it } from 'vitest';
import { BcryptHasher } from '../../../../src/infrastructure/adapters/bcrypt.hasher.js';

describe('BcryptHasher', () => {
    const hasher = new BcryptHasher();

    describe('hash', () => {
        it('should generate a hash different from the raw password', async () => {
            const password = 'my-secret-password';
            const hash = await hasher.hash(password);

            expect(hash).not.toBe(password);
            expect(hash).toHaveLength(60);
        });
    });

    describe('compare', () => {
        it('should return true for a valid password', async () => {
            const password = 'password123';
            const hash = await hasher.hash(password);

            const result = await hasher.compare(password, hash);
            expect(result).toBe(true);
        });

        it('should return false for an invalid password', async () => {
            const password = 'password123';
            const hash = await hasher.hash(password);

            const result = await hasher.compare('wrong-password', hash);
            expect(result).toBe(false);
        });
    });
});
