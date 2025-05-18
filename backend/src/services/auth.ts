import { Response } from 'express';
import jwt from 'jsonwebtoken';

import { UserDocument } from '../models/User';

export const createAccessToken = (res: Response, user: UserDocument) => {
    const { _id } = user;

    const token = jwt.sign({ _id }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
    });

    res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 3600000, // 1 hour
    });
};

export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
        return null;
    }
};

export const removeAccessToken = (res: Response) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
};
