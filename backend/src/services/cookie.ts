import { CookieOptions, Response } from 'express';

// Base function, only called in this service
const setCookie = (res: Response, name: string, value: string, options: CookieOptions) => {
    res.cookie(name, value, options);
};

export const setAccessTokenCookie = (res: Response, token: string, rememberMe: boolean) => {
    const maxAge = rememberMe ? 15 * 60 * 1000 : undefined; // 15 minutes

    setCookie(res, 'access_token', token, {
        maxAge,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
};

export const setRefreshTokenCookie = (res: Response, token: string, rememberMe: boolean) => {
    const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined; // 7 days

    setCookie(res, 'refresh_token', token, {
        maxAge,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
};

export const setRememberMeCookie = (res: Response, rememberMe: boolean) => {
    const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined; // 7 days

    setCookie(res, 'remember_me', rememberMe.toString(), {
        maxAge,
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
    });
};

// Base function, only called in this service
const clearCookie = (res: Response, name: string) => {
    res.clearCookie(name);
};

export const clearAccessTokenCookie = (res: Response) => {
    clearCookie(res, 'access_token');
};

export const clearRefreshTokenCookie = (res: Response) => {
    clearCookie(res, 'refresh_token');
};

export const clearRememberMeCookie = (res: Response) => {
    clearCookie(res, 'remember_me');
};

export const clearAllAuthCookies = (res: Response) => {
    clearAccessTokenCookie(res);
    clearRefreshTokenCookie(res);
    clearRememberMeCookie(res);
};
