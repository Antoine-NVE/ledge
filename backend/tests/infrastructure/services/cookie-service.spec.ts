import { Request, Response } from 'express';

jest.mock('../../../src/infrastructure/utils/parse', () => ({
    parseBoolean: jest.fn(),
}));

import { parseBoolean } from '../../../src/infrastructure/utils/parse';
import { CookieService } from '../../../src/infrastructure/services/cookie-service';

describe('CookieService', () => {
    let reqMock: Request;
    let resMock: Response;
    let cookieService: CookieService;

    beforeEach(() => {
        jest.clearAllMocks(); // for parseBoolean

        reqMock = { cookies: {} } as unknown as Request;
        resMock = {
            cookie: jest.fn(),
            clearCookie: jest.fn(),
        } as unknown as Response;

        cookieService = new CookieService(reqMock, resMock);
    });

    describe('setAccessToken', () => {
        it('sets cookie with 15min maxAge when rememberMe is true', () => {
            const token = 'abc123';
            cookieService.setAccessToken(token, true);

            expect(resMock.cookie).toHaveBeenCalledWith(
                'access_token',
                token,
                expect.objectContaining({
                    maxAge: 15 * 60 * 1000,
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                }),
            );
        });

        it('sets cookie without maxAge when rememberMe is false', () => {
            const token = 'xyz789';
            cookieService.setAccessToken(token, false);

            expect(resMock.cookie).toHaveBeenCalledWith(
                'access_token',
                token,
                expect.objectContaining({
                    maxAge: undefined,
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                }),
            );
        });
    });

    describe('setRefreshToken', () => {
        it('sets cookie with 7 days maxAge when rememberMe is true', () => {
            const token = 'ref123';
            cookieService.setRefreshToken(token, true);

            expect(resMock.cookie).toHaveBeenCalledWith(
                'refresh_token',
                token,
                expect.objectContaining({
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                }),
            );
        });

        it('sets cookie without maxAge when rememberMe is false', () => {
            const token = 'ref456';
            cookieService.setRefreshToken(token, false);

            expect(resMock.cookie).toHaveBeenCalledWith(
                'refresh_token',
                token,
                expect.objectContaining({
                    maxAge: undefined,
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                }),
            );
        });
    });

    describe('setRememberMe', () => {
        it('sets cookie with 7 days maxAge when rememberMe is true', () => {
            cookieService.setRememberMe(true);

            expect(resMock.cookie).toHaveBeenCalledWith(
                'remember_me',
                'true',
                expect.objectContaining({
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    httpOnly: false,
                    secure: true,
                    sameSite: 'strict',
                }),
            );
        });

        it('sets cookie without maxAge when rememberMe is false', () => {
            cookieService.setRememberMe(false);

            expect(resMock.cookie).toHaveBeenCalledWith(
                'remember_me',
                'false',
                expect.objectContaining({
                    maxAge: undefined,
                    httpOnly: false,
                    secure: true,
                    sameSite: 'strict',
                }),
            );
        });
    });

    describe('setAuth', () => {
        it('creates three cookies and sets proper maxAges when rememberMe is true', () => {
            const access = 'access-1';
            const refresh = 'refresh-1';

            cookieService.setAuth(access, refresh, true);

            expect(resMock.cookie).toHaveBeenCalledTimes(3);
            expect(resMock.cookie).toHaveBeenCalledWith(
                'access_token',
                access,
                expect.objectContaining({ maxAge: 15 * 60 * 1000 }),
            );
            expect(resMock.cookie).toHaveBeenCalledWith(
                'refresh_token',
                refresh,
                expect.objectContaining({ maxAge: 7 * 24 * 60 * 60 * 1000 }),
            );
            expect(resMock.cookie).toHaveBeenCalledWith(
                'remember_me',
                'true',
                expect.objectContaining({ maxAge: 7 * 24 * 60 * 60 * 1000 }),
            );
        });

        it('creates three cookies and omits maxAges when rememberMe is false', () => {
            const access = 'access-2';
            const refresh = 'refresh-2';

            cookieService.setAuth(access, refresh, false);

            expect(resMock.cookie).toHaveBeenCalledTimes(3);
            expect(resMock.cookie).toHaveBeenCalledWith(
                'access_token',
                access,
                expect.objectContaining({ maxAge: undefined }),
            );
            expect(resMock.cookie).toHaveBeenCalledWith(
                'refresh_token',
                refresh,
                expect.objectContaining({ maxAge: undefined }),
            );
            expect(resMock.cookie).toHaveBeenCalledWith(
                'remember_me',
                'false',
                expect.objectContaining({ maxAge: undefined }),
            );
        });
    });

    describe('getAccessToken', () => {
        it('returns access token from request cookies if present', () => {
            reqMock.cookies = { access_token: 'abc123' };
            expect(cookieService.getAccessToken()).toBe('abc123');
        });

        it('returns undefined when access token is not present', () => {
            reqMock.cookies = {};
            expect(cookieService.getAccessToken()).toBeUndefined();
        });
    });

    describe('getRefreshToken', () => {
        it('returns refresh token from request cookies if present', () => {
            reqMock.cookies = { refresh_token: 'ref123' };
            expect(cookieService.getRefreshToken()).toBe('ref123');
        });

        it('returns undefined when refresh token is not present', () => {
            reqMock.cookies = {};
            expect(cookieService.getRefreshToken()).toBeUndefined();
        });
    });

    describe('getRememberMe', () => {
        it('returns true when remember_me cookie is "true"', () => {
            reqMock.cookies = { remember_me: 'true' };
            (parseBoolean as jest.Mock).mockReturnValueOnce(true);

            expect(cookieService.getRememberMe()).toBe(true);
            expect(parseBoolean).toHaveBeenCalledWith('true');
        });

        it('returns false when remember_me cookie is "false"', () => {
            reqMock.cookies = { remember_me: 'false' };
            (parseBoolean as jest.Mock).mockReturnValueOnce(false);

            expect(cookieService.getRememberMe()).toBe(false);
            expect(parseBoolean).toHaveBeenCalledWith('false');
        });

        it('returns false when remember_me cookie is missing', () => {
            reqMock.cookies = {};
            expect(cookieService.getRememberMe()).toBe(false);
            expect(parseBoolean).toHaveBeenCalledWith(undefined);
        });

        it('returns false when remember_me cookie has an invalid value', () => {
            reqMock.cookies = { remember_me: 'invalid' };
            (parseBoolean as jest.Mock).mockReturnValueOnce(undefined);

            expect(cookieService.getRememberMe()).toBe(false);
            expect(parseBoolean).toHaveBeenCalledWith('invalid');
        });
    });

    describe('clearAccessToken', () => {
        it('clears access_token cookie', () => {
            cookieService.clearAccessToken();

            expect(resMock.clearCookie).toHaveBeenCalled();
            expect((resMock.clearCookie as jest.Mock).mock.calls[0][0]).toBe(
                'access_token',
            );
        });
    });

    describe('clearRefreshToken', () => {
        it('clears refresh_token cookie', () => {
            cookieService.clearRefreshToken();

            expect(resMock.clearCookie).toHaveBeenCalled();
            expect((resMock.clearCookie as jest.Mock).mock.calls[0][0]).toBe(
                'refresh_token',
            );
        });
    });

    describe('clearRememberMe', () => {
        it('clears remember_me cookie', () => {
            cookieService.clearRememberMe();

            expect(resMock.clearCookie).toHaveBeenCalled();
            expect((resMock.clearCookie as jest.Mock).mock.calls[0][0]).toBe(
                'remember_me',
            );
        });
    });

    describe('clearAuth', () => {
        it('clears all three cookies', () => {
            cookieService.clearAuth();

            expect(resMock.clearCookie).toHaveBeenCalledTimes(3);
            const calledNames = (
                resMock.clearCookie as jest.Mock
            ).mock.calls.map((c) => c[0]);
            expect(calledNames).toEqual([
                'access_token',
                'refresh_token',
                'remember_me',
            ]);
        });
    });
});
