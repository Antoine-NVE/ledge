import type { Request, Response } from 'express';

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string, rememberMe: boolean): void => {
    const refreshMaxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined;
    const accessMaxAge = rememberMe ? 15 * 60 * 1000 : undefined;

    res.cookie('accessToken', accessToken, {
        maxAge: accessMaxAge,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });

    res.cookie('refreshToken', refreshToken, {
        maxAge: refreshMaxAge,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });

    if (rememberMe) {
        res.cookie('rememberMe', 'true', {
            maxAge: refreshMaxAge,
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
        });
    }
};

export const clearAuthCookies = (res: Response): void => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('rememberMe');
};

export const findAccessToken = (req: Request): string | null => {
    return req.cookies['accessToken'] ?? null;
};

export const findRefreshToken = (req: Request): string | null => {
    return req.cookies['refreshToken'] ?? null;
};

export const findRememberMe = (req: Request): boolean => {
    return req.cookies['rememberMe'] === 'true';
};
