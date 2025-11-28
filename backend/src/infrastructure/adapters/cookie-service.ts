import { CookieOptions, Request, Response } from 'express';
import { parseBoolean } from '../utils/parse';

export class CookieService {
    constructor(
        private req: Request,
        private res: Response,
    ) {}

    private set = (
        name: string,
        value: string,
        options: CookieOptions,
    ): void => {
        this.res.cookie(name, value, options);
    };

    setAccessToken = (token: string, rememberMe: boolean): void => {
        const maxAge = rememberMe ? 15 * 60 * 1000 : undefined; // 15 minutes

        this.set('access_token', token, {
            maxAge,
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
    };

    setRefreshToken = (token: string, rememberMe: boolean): void => {
        const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined; // 7 days

        this.set('refresh_token', token, {
            maxAge,
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
    };

    setRememberMe = (rememberMe: boolean): void => {
        const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined; // 7 days

        this.set('remember_me', rememberMe.toString(), {
            maxAge,
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
        });
    };

    setAuth = (
        accessToken: string,
        refreshToken: string,
        rememberMe: boolean,
    ): void => {
        this.setAccessToken(accessToken, rememberMe);
        this.setRefreshToken(refreshToken, rememberMe);
        this.setRememberMe(rememberMe);
    };

    private get = (name: string): string | undefined => {
        return this.req.cookies[name];
    };

    getAccessToken = (): string | undefined => {
        return this.get('access_token');
    };

    getRefreshToken = (): string | undefined => {
        return this.get('refresh_token');
    };

    getRememberMe = (): boolean => {
        const value = parseBoolean(this.get('remember_me'));
        if (value === undefined) return false;
        return value;
    };

    private clear = (name: string): void => {
        this.res.clearCookie(name);
    };

    clearAccessToken = (): void => {
        this.clear('access_token');
    };

    clearRefreshToken = (): void => {
        this.clear('refresh_token');
    };

    clearRememberMe = (): void => {
        this.clear('remember_me');
    };

    clearAuth = (): void => {
        this.clearAccessToken();
        this.clearRefreshToken();
        this.clearRememberMe();
    };
}
