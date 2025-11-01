import { TokenService } from '../../../infrastructure/services/token-service';

describe('TokenService', () => {
    let tokenService: TokenService;

    beforeEach(() => {
        tokenService = new TokenService();
    });

    describe('generate', () => {
        it('should generate a token of default length 64', () => {
            const token = tokenService.generate();
            expect(token).toHaveLength(64);
            expect(typeof token).toBe('string');
        });

        it('should generate a token of specified length', () => {
            const length = 32;
            const token = tokenService.generate(length);
            expect(token).toHaveLength(length);
        });

        it('should handle negative length by converting to positive', () => {
            const token = tokenService.generate(-32);
            expect(token).toHaveLength(32);
        });

        it('should handle decimal length by rounding down', () => {
            const token = tokenService.generate(10.7);
            expect(token).toHaveLength(10);
        });

        it('should generate different tokens on each call', () => {
            const token1 = tokenService.generate();
            const token2 = tokenService.generate();
            expect(token1).not.toBe(token2);
        });
    });
});
