import { Response } from 'express';

type CookieOptions = { httpOnly: boolean; secure: boolean; sameSite: 'strict' | 'lax' | 'none' };

const cookieBaseOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
};

const rememberMeCookieOptions: CookieOptions = {
    httpOnly: false,
    secure: true,
    sameSite: 'strict',
};

export const setAccessTokenCookie = (res: Response, token: string, rememberMe: boolean) => {
    res.cookie('access_token', token, {
        ...cookieBaseOptions,
        ...(rememberMe ? { maxAge: 3600000 } : {}), // 1 hour
    });
};

export const clearAccessTokenCookie = (res: Response) => {
    res.clearCookie('access_token', {
        ...cookieBaseOptions,
    });
};

export const setRefreshTokenCookie = (res: Response, token: string, rememberMe: boolean) => {
    res.cookie('refresh_token', token, {
        ...cookieBaseOptions,
        ...(rememberMe ? { maxAge: 604800000 } : {}), // 7 days
    });
};

export const clearRefreshTokenCookie = (res: Response) => {
    res.clearCookie('refresh_token', {
        ...cookieBaseOptions,
    });
};

export const setRememberMeCookie = (res: Response, rememberMe: boolean) => {
    res.cookie('remember_me', rememberMe, {
        ...rememberMeCookieOptions,
        ...(rememberMe ? { maxAge: 604800000 } : {}), // 7 days
    });
};

export const clearRememberMeCookie = (res: Response) => {
    res.clearCookie('remember_me', {
        ...rememberMeCookieOptions,
    });
};

export const clearAllAuthCookies = (res: Response) => {
    clearAccessTokenCookie(res);
    clearRefreshTokenCookie(res);
    clearRememberMeCookie(res);
};
