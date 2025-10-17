import { Request, Response } from 'express';
import { CookieService } from '../../services/CookieService';

describe('CookieService', () => {
    let cookieService: CookieService;
    let setSpy: jest.SpyInstance;
    let getSpy: jest.SpyInstance;
    let clearSpy: jest.SpyInstance;

    beforeEach(() => {
        cookieService = new CookieService({} as unknown as Request, {} as unknown as Response);
        setSpy = jest.spyOn(cookieService as any, 'set').mockImplementation();
        getSpy = jest.spyOn(cookieService as any, 'get').mockImplementation();
        clearSpy = jest
            .spyOn(cookieService as any, 'clear')
            .mockImplementation();
    });

    describe('setAccessToken', () => {
        it('should call set with correct args', () => {
            cookieService.setAccessToken('test_token', true);
            expect(setSpy).toHaveBeenCalledWith('access_token', 'test_token', {
                maxAge: 15 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });
        });
    });

    describe('setRefreshToken', () => {
        it('should call set with correct args', () => {
            cookieService.setRefreshToken('refresh_token', false);
            expect(setSpy).toHaveBeenCalledWith(
                'refresh_token',
                'refresh_token',
                {
                    maxAge: undefined,
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                },
            );
        });
    });

    describe('setRememberMe', () => {
        it('should call set with correct args', () => {
            cookieService.setRememberMe(true);
            expect(setSpy).toHaveBeenCalledWith('remember_me', 'true', {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: false,
                secure: true,
                sameSite: 'strict',
            });
        });
    });

    describe('setAuth', () => {
        it('should call set three times', () => {
            cookieService.setAuth('access_token', 'refresh_token', false);
            expect(setSpy).toHaveBeenCalledTimes(3);
        });
    });

    describe('getAccessToken', () => {
        it('should call get with correct arg', () => {
            cookieService.getAccessToken();
            expect(getSpy).toHaveBeenCalledWith('access_token');
        });
    });

    describe('getRefreshToken', () => {
        it('should call get with correct arg', () => {
            cookieService.getRefreshToken();
            expect(getSpy).toHaveBeenCalledWith('refresh_token');
        });
    });

    describe('getRememberMe', () => {
        it('should call get with correct arg', () => {
            cookieService.getRememberMe();
            expect(getSpy).toHaveBeenCalledWith('remember_me');
        });
    });

    describe('clearAccessToken', () => {
        it('should call clear with correct arg', () => {
            cookieService.clearAccessToken();
            expect(clearSpy).toHaveBeenCalledWith('access_token');
        });
    });

    describe('clearRefreshToken', () => {
        it('should call clear with correct arg', () => {
            cookieService.clearRefreshToken();
            expect(clearSpy).toHaveBeenCalledWith('refresh_token');
        });
    });

    describe('clearRememberMe', () => {
        it('should call clear with correct arg', () => {
            cookieService.clearRememberMe();
            expect(clearSpy).toHaveBeenCalledWith('remember_me');
        });
    });

    describe('clearAuth', () => {
        it('should call clear three times', () => {
            cookieService.clearAuth();
            expect(clearSpy).toHaveBeenCalledTimes(3);
        });
    });
});
