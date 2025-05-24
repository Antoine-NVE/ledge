import { Response } from 'express';
import { UserDocument } from '../models/User';
import { createJwt } from '../utils/jwt';

export const setAccessTokenCookie = (res: Response, user: UserDocument) => {
    const token = createJwt({
        _id: user._id,
    });

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
        secure: false,
        sameSite: 'strict',
    });
};
