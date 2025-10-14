import { generateToken } from '../../utils/token';

describe('token utils', () => {
    describe('generateToken', () => {
        it('should generate a token of the specified length', () => {
            const token = generateToken(32);
            expect(token).toHaveLength(32);
            expect(typeof token).toBe('string');
        });

        it('should generate a token with default length when no length is provided', () => {
            const token = generateToken();
            expect(token).toHaveLength(64);
            expect(typeof token).toBe('string');
        });

        it('should handle negative lengths by converting them to positive', () => {
            const token = generateToken(-16);
            expect(token).toHaveLength(16);
            expect(typeof token).toBe('string');
        });

        it('should handle non-integer lengths by flooring them', () => {
            const token = generateToken(20.7);
            expect(token).toHaveLength(20);
            expect(typeof token).toBe('string');
        });

        it('should return an empty string when length is zero', () => {
            const token = generateToken(0);
            expect(token).toBe('');
        });
    });
});
