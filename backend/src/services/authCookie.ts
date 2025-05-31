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
