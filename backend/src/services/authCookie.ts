import { Response } from 'express';

export const setAccessTokenCookie = (res: Response, token: string) => {
    res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 3600000, // 1 hour
    });
};

export const clearAccessToken = (res: Response) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
};

export const setRefreshTokenCookie = (res: Response, token: string) => {
    res.cookie('refresh_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 604800000, // 7 days
    });
};

export const clearRefreshToken = (res: Response) => {
    res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
};
