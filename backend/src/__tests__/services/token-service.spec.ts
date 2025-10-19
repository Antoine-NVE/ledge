import { TokenService } from '../../services/TokenService';

describe('TokenService', () => {
    let tokenService: TokenService;

    beforeEach(() => {
        jest.clearAllMocks();

        tokenService = new TokenService();
    });

    describe('generate', () => {
        it('should generate a 64 characters length token by default', () => {
            expect(tokenService.generate()).toHaveLength(64);
        });

        it('should generate a token with an asked size', () => {
            expect(tokenService.generate(32)).toHaveLength(32);
            expect(tokenService.generate(16)).toHaveLength(16);
            expect(tokenService.generate(0)).toHaveLength(0);
        });

        it('should transform invalid numbers', () => {
            expect(tokenService.generate(31.48)).toHaveLength(31);
            expect(tokenService.generate(-16)).toHaveLength(16);
        });
    });
});
