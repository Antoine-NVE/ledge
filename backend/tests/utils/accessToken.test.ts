import { jest, describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';

import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { clearAccessToken, createAccessToken, verifyAccessToken } from '../../src/utils/accessToken';
import { UserDocument } from '../../src/models/User';

jest.mock('jsonwebtoken');
const mockSign = jwt.sign as jest.Mock;
const mockVerify = jwt.verify as jest.Mock;

const DUMMY_TOKEN = 'dummy.jwt.token';
mockSign.mockReturnValue(DUMMY_TOKEN);

describe('createAccessToken', () => {
    const OLD_SECRET = process.env.JWT_SECRET;
    beforeAll(() => {
        process.env.JWT_SECRET = 'test_secret';
    });
    afterAll(() => {
        process.env.JWT_SECRET = OLD_SECRET;
    });

    it('should sign a JWT and set it as an HTTP‐only cookie', () => {
        const cookieSpy = jest.fn();
        const res = {
            cookie: cookieSpy,
        } as unknown as Response;

        const user = { _id: 'abc123' } as unknown as UserDocument;

        createAccessToken(res, user);

        expect(mockSign).toHaveBeenCalledWith({ _id: 'abc123' }, 'test_secret', { expiresIn: '1h' });

        expect(cookieSpy).toHaveBeenCalledWith(
            'access_token',
            DUMMY_TOKEN,
            expect.objectContaining({
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 3600000,
            }),
        );
    });
});

describe('verifyAccessToken', () => {
    const OLD_SECRET = process.env.JWT_SECRET;

    beforeAll(() => {
        process.env.JWT_SECRET = 'test_secret';
    });

    afterAll(() => {
        process.env.JWT_SECRET = OLD_SECRET;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the decoded payload when jwt.verify succeeds', () => {
        const decodedPayload = { _id: 'abc123', iat: 1_234_567, exp: 1_234_567 + 3600 };
        mockVerify.mockReturnValue(decodedPayload);

        const result = verifyAccessToken('valid.token.here');

        expect(mockVerify).toHaveBeenCalledWith('valid.token.here', 'test_secret');
        expect(result).toEqual(decodedPayload);
    });

    it('should return null and log an error when jwt.verify throws', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const testError = new Error('invalid token');
        mockVerify.mockImplementation(() => {
            throw testError;
        });

        const result = verifyAccessToken('invalid.token.here');

        expect(mockVerify).toHaveBeenCalledWith('invalid.token.here', 'test_secret');
        expect(consoleSpy).toHaveBeenCalledWith(testError);
        expect(result).toBeNull();

        consoleSpy.mockRestore();
    });
});

describe('clearAccessToken', () => {
    it('should clear the access_token cookie with the proper options', () => {
        const clearCookieSpy = jest.fn();
        const res = {
            clearCookie: clearCookieSpy,
        } as unknown as Response;

        clearAccessToken(res);

        expect(clearCookieSpy).toHaveBeenCalledWith(
            'access_token',
            expect.objectContaining({
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            }),
        );
    });
});
