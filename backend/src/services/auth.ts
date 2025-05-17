import { Response } from 'express';
import jwt from 'jsonwebtoken';

import { UserDocument } from '../models/User';

export const connect = (res: Response, user: UserDocument) => {
    const { _id } = user;

    const token = jwt.sign({ _id }, 'azerty', {
        expiresIn: '1h',
    });

    res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 3600000, // 1 hour
    });
};
