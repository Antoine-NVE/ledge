import { describe, it, expect } from 'vitest';
import { CryptoTokenGenerator } from '../../../../src/infrastructure/adapters/crypto.token-generator.js';

describe('CryptoTokenGenerator', () => {
    const generator = new CryptoTokenGenerator();

    describe('generate', () => {
        it('should generate a token of the requested length', () => {
            const length = 32;
            const token = generator.generate(length);

            expect(token).toHaveLength(length);
        });

        it('should generate a token with default length (64) if not specified', () => {
            const token = generator.generate();
            expect(token).toHaveLength(64);
        });

        it('should generate a valid hexadecimal string', () => {
            const token = generator.generate(10);
            expect(token).toMatch(/^[0-9a-f]+$/);
        });
    });
});
