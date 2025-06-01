import { generateToken } from '../../utils/token';

describe('generateToken', () => {
    it('should generate a token of correct length (default)', () => {
        const token = generateToken();
        // Each byte is 2 hex chars, so 64 bytes = 128 chars
        expect(token).toHaveLength(128);
        expect(typeof token).toBe('string');
    });

    it('should generate a token of correct length (custom)', () => {
        const length = 32;
        const token = generateToken(length);
        expect(token).toHaveLength(length * 2);
    });

    it('should generate different tokens on each call', () => {
        const token1 = generateToken();
        const token2 = generateToken();
        expect(token1).not.toBe(token2);
    });

    it('should handle length of 0', () => {
        const token = generateToken(0);
        expect(token).toBe('');
    });

    it('should throw if length is negative', () => {
        expect(() => generateToken(-1)).toThrow();
    });
});
