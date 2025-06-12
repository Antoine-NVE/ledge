import { createJwt, verifyJwt, setJwtSecret } from '../../utils/jwt';

describe('JWT Utilities', () => {
    beforeAll(() => {
        setJwtSecret('test-secret');
    });

    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should create a valid JWT and verify it', () => {
        const token = createJwt('abc123');
        const decoded = verifyJwt(token) as { _id: string; iat: number; exp: number };

        expect(decoded).toHaveProperty('_id', 'abc123');
    });

    it('should return null for an invalid token', () => {
        const result = verifyJwt('invalid.token');
        expect(result).toBeNull();
    });

    it('should handle expired tokens', () => {
        const token = createJwt('abc123', '1ms');
        return new Promise((resolve) => {
            setTimeout(() => {
                const result = verifyJwt(token);
                expect(result).toBeNull();
                resolve(undefined);
            }, 10);
        });
    });
});
