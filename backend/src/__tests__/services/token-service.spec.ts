import { TokenService } from '../../services/TokenService';

describe('TokenService', () => {
    let tokenService: TokenService;

    beforeEach(() => {
        tokenService = new TokenService();
    });

    describe('generate()', () => {
        it('should generate a token of default length 64', () => {
            const token = tokenService.generate();
            expect(token).toHaveLength(64);
            expect(/^[a-f0-9]{64}$/.test(token)).toBe(true); // Check if it's a hex string
        });

        it('should generate a token of specified length', () => {
            const lengths = [16, 32, 128];
            lengths.forEach((length) => {
                const token = tokenService.generate(length);
                expect(token).toHaveLength(length);
                expect(/^[a-f0-9]+$/.test(token)).toBe(true); // Check if it's a hex string
            });
        });

        it('should handle negative and non-integer lengths by converting to positive integer', () => {
            const token1 = tokenService.generate(-32);
            expect(token1).toHaveLength(32);

            const token2 = tokenService.generate(20.7);
            expect(token2).toHaveLength(20);
        });
    });
});
