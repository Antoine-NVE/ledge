import { Request, Response } from 'express';
import { CookieService } from '../../services/CookieService';

describe('CookieService', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let cookieService: CookieService;

    beforeEach(() => {
        req = { cookies: {} };
        res = {
            cookie: jest.fn(),
            clearCookie: jest.fn(),
        };
        cookieService = new CookieService(req as Request, res as Response);
    });

    describe('setAccessToken()', () => {
        it('should call res.cookie with correct arguments', () => {
            cookieService.setAccessToken('token123', true);

            expect(res.cookie).toHaveBeenCalledWith(
                'access_token',
                'token123',
                expect.objectContaining({
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 15 * 60 * 1000, // 15 min
                }),
            );
        });

        it('should omit maxAge if rememberMe is false', () => {
            cookieService.setAccessToken('token123', false);

            expect(res.cookie).toHaveBeenCalledWith(
                'access_token',
                'token123',
                expect.not.objectContaining({ maxAge: expect.any(Number) }),
            );
        });
    });

    describe('setRefreshToken()', () => {
        it('should call res.cookie with correct arguments', () => {
            cookieService.setRefreshToken('token456', true);

            expect(res.cookie).toHaveBeenCalledWith(
                'refresh_token',
                'token456',
                expect.objectContaining({
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                }),
            );
        });

        it('should omit maxAge if rememberMe is false', () => {
            cookieService.setRefreshToken('token456', false);

            expect(res.cookie).toHaveBeenCalledWith(
                'refresh_token',
                'token456',
                expect.not.objectContaining({ maxAge: expect.any(Number) }),
            );
        });
    });

    describe('setRememberMe()', () => {
        it('should call res.cookie with correct arguments', () => {
            cookieService.setRememberMe(true);

            expect(res.cookie).toHaveBeenCalledWith(
                'remember_me',
                'true',
                expect.objectContaining({
                    httpOnly: false,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                }),
            );
        });

        it('should omit maxAge if rememberMe is false', () => {
            cookieService.setRememberMe(false);

            expect(res.cookie).toHaveBeenCalledWith(
                'remember_me',
                'false',
                expect.not.objectContaining({ maxAge: expect.any(Number) }),
            );
        });
    });

    describe('setAuth()', () => {
        it('should set all three cookies (access, refresh, remember_me)', () => {
            cookieService.setAuth('a', 'b', true);

            expect(res.cookie).toHaveBeenCalledTimes(3);
            expect(res.cookie).toHaveBeenCalledWith(
                'access_token',
                'a',
                expect.any(Object),
            );
            expect(res.cookie).toHaveBeenCalledWith(
                'refresh_token',
                'b',
                expect.any(Object),
            );
            expect(res.cookie).toHaveBeenCalledWith(
                'remember_me',
                'true',
                expect.any(Object),
            );
        });
    });

    describe('getAccessToken()', () => {
        it('should return the access token from request cookies', () => {
            req.cookies = { access_token: 'abc123' };
            expect(cookieService.getAccessToken()).toBe('abc123');
        });
    });

    describe('getRefreshToken()', () => {
        it('should return the refresh token from request cookies', () => {
            req.cookies = { refresh_token: 'def456' };
            expect(cookieService.getRefreshToken()).toBe('def456');
        });
    });

    describe('getRememberMe()', () => {
        it('should return a boolean when cookie is "true" or "false"', () => {
            req.cookies = { remember_me: 'true' };
            expect(cookieService.getRememberMe()).toBe(true);

            req.cookies = { remember_me: 'false' };
            expect(cookieService.getRememberMe()).toBe(false);
        });

        it('should return undefined when cookie is missing', () => {
            req.cookies = {};
            expect(cookieService.getRememberMe()).toBeUndefined();
        });
    });

    describe('clearAccessToken()', () => {
        it('should call res.clearCookie with correct arguments', () => {
            cookieService.clearAccessToken();

            expect(res.clearCookie).toHaveBeenCalledWith('access_token');
        });
    });

    describe('clearRefreshToken()', () => {
        it('should call res.clearCookie with correct arguments', () => {
            cookieService.clearRefreshToken();

            expect(res.clearCookie).toHaveBeenCalledWith('refresh_token');
        });
    });

    describe('clearRememberMe()', () => {
        it('should call res.clearCookie with correct arguments', () => {
            cookieService.clearRememberMe();

            expect(res.clearCookie).toHaveBeenCalledWith('remember_me');
        });
    });

    describe('clearAuth()', () => {
        it('should clear all three cookies', () => {
            cookieService.clearAuth();

            expect(res.clearCookie).toHaveBeenCalledTimes(3);
            expect(res.clearCookie).toHaveBeenCalledWith('access_token');
            expect(res.clearCookie).toHaveBeenCalledWith('refresh_token');
            expect(res.clearCookie).toHaveBeenCalledWith('remember_me');
        });
    });
});
