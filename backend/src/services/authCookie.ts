import { Response } from 'express';

export const setAccessTokenCookie = (res: Response, token: string, rememberMe: boolean) => {
    res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        ...(rememberMe ? { maxAge: 3600000 } : {}), // 1 hour
    });
};

export const clearAccessToken = (res: Response) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
};

export const setRefreshTokenCookie = (res: Response, token: string, rememberMe: boolean) => {
    res.cookie('refresh_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        ...(rememberMe ? { maxAge: 604800000 } : {}), // 7 days
    });
};

export const clearRefreshToken = (res: Response) => {
    res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
};

export const setRememberMeCookie = (res: Response, rememberMe: boolean) => {
    res.cookie('remember_me', rememberMe, {
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
        ...(rememberMe ? { maxAge: 604800000 } : {}), // 7 days
    });
};

export const clearRememberMeCookie = (res: Response) => {
    res.clearCookie('remember_me', {
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
    });
};
