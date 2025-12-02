import { Request, Response } from 'express';
import { parseBoolean } from '../../../infrastructure/utils/parse';

export class CookieManager {
    setAccessToken = (
        res: Response,
        token: string,
        rememberMe: boolean,
    ): void => {
        const maxAge = rememberMe ? 15 * 60 * 1000 : undefined; // 15 minutes

        res.cookie('access_token', token, {
            maxAge,
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
    };

    setRefreshToken = (
        res: Response,
        token: string,
        rememberMe: boolean,
    ): void => {
        const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined; // 7 days

        res.cookie('refresh_token', token, {
            maxAge,
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
    };

    setRememberMe = (res: Response, rememberMe: boolean): void => {
        const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined; // 7 days

        res.cookie('remember_me', rememberMe.toString(), {
            maxAge,
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
        });
    };

    setAuth = (
        res: Response,
        accessToken: string,
        refreshToken: string,
        rememberMe: boolean,
    ): void => {
        this.setAccessToken(res, accessToken, rememberMe);
        this.setRefreshToken(res, refreshToken, rememberMe);
        this.setRememberMe(res, rememberMe);
    };

    getAccessToken = (req: Request): string | undefined => {
        return req.cookies['access_token'];
    };

    getRefreshToken = (req: Request): string | undefined => {
        return req.cookies['refresh_token'];
    };

    getRememberMe = (req: Request): boolean | undefined => {
        return parseBoolean(req.cookies['remember_me']);
    };

    clearAccessToken = (res: Response): void => {
        res.clearCookie('access_token');
    };

    clearRefreshToken = (res: Response): void => {
        res.clearCookie('refresh_token');
    };

    clearRememberMe = (res: Response): void => {
        res.clearCookie('remember_me');
    };

    clearAuth = (res: Response): void => {
        this.clearAccessToken(res);
        this.clearRefreshToken(res);
        this.clearRememberMe(res);
    };
}
