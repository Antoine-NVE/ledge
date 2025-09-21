import { CookieOptions, Request, Response } from 'express';

// Base function, only called in this service
const setCookie = (res: Response, name: string, value: string, options: CookieOptions): void => {
    res.cookie(name, value, options);
};

export const setAccessTokenCookie = (res: Response, token: string, rememberMe: boolean): void => {
    const maxAge = rememberMe ? 15 * 60 * 1000 : undefined; // 15 minutes

    setCookie(res, 'access_token', token, {
        maxAge,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
};

export const setRefreshTokenCookie = (res: Response, token: string, rememberMe: boolean): void => {
    const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined; // 7 days

    setCookie(res, 'refresh_token', token, {
        maxAge,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
};

export const setRememberMeCookie = (res: Response, rememberMe: boolean): void => {
    const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined; // 7 days

    setCookie(res, 'remember_me', rememberMe.toString(), {
        maxAge,
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
    });
};

// Base function, only called in this service
const getCookie = (req: Request, name: string): string | undefined => {
    return req.cookies[name];
}

export const getAccessTokenCookie = (req: Request): string | undefined => {
    return getCookie(req, 'access_token');
}

export const getRefreshTokenCookie = (req: Request): string | undefined => {
    return getCookie(req, 'refresh_token');
}

export const getRememberMeCookie = (req: Request): boolean => {
    const value = getCookie(req, 'remember_me');
    return value === 'true';
};

// Base function, only called in this service
const clearCookie = (res: Response, name: string): void => {
    res.clearCookie(name);
};

export const clearAccessTokenCookie = (res: Response): void => {
    clearCookie(res, 'access_token');
};

export const clearRefreshTokenCookie = (res: Response): void => {
    clearCookie(res, 'refresh_token');
};

export const clearRememberMeCookie = (res: Response): void => {
    clearCookie(res, 'remember_me');
};

export const clearAllAuthCookies = (res: Response): void => {
    clearAccessTokenCookie(res);
    clearRefreshTokenCookie(res);
    clearRememberMeCookie(res);
};
