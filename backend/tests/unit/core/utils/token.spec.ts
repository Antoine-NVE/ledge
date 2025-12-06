import { generateToken } from '../../../../src/core/utils/token';

describe('token utils', () => {
    describe('generateToken', () => {
        it('should generate a token of default length 64', () => {
            const token = generateToken();
            expect(token).toHaveLength(64);
            expect(typeof token).toBe('string');
        });

        it('should generate a token of specified length', () => {
            const length = 32;
            const token = generateToken(length);
            expect(token).toHaveLength(length);
        });

        it('should handle negative length by converting to positive', () => {
            const token = generateToken(-32);
            expect(token).toHaveLength(32);
        });

        it('should handle decimal length by rounding down', () => {
            const token = generateToken(10.7);
            expect(token).toHaveLength(10);
        });

        it('should generate different tokens on each call', () => {
            const token1 = generateToken();
            const token2 = generateToken();
            expect(token1).not.toBe(token2);
        });
    });
});
