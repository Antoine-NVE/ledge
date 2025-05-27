import { describe, it, expect, beforeAll, beforeEach, afterEach, jest } from '@jest/globals';
import { createJwt, verifyJwt, setJwtSecret } from '../../src/utils/jwt';

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
        const payload = { userId: 'abc123' };
        const token = createJwt(payload);
        const decoded = verifyJwt(token) as { userId: string; iat: number; exp: number };

        expect(decoded).toHaveProperty('userId', 'abc123');
    });

    it('should return null for an invalid token', () => {
        const result = verifyJwt('invalid.token');
        expect(result).toBeNull();
    });

    it('should handle expired tokens', () => {
        const token = createJwt({ userId: 'abc123' }, '1ms');
        return new Promise((resolve) => {
            setTimeout(() => {
                const result = verifyJwt(token);
                expect(result).toBeNull();
                resolve(undefined);
            }, 10);
        });
    });
});
