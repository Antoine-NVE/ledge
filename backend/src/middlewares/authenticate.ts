import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/accessToken';
import UserModel, { UserDocument } from '../models/User';

// Extend Express Request interface to include userId
declare module 'express-serve-static-core' {
    interface Request {
        user?: UserDocument;
    }
}

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
        res.status(401).json({
            message: 'Unauthorized',
            data: null,
            errors: null,
        });
        return;
    }

    const decoded = verifyAccessToken(access_token);

    if (typeof decoded === 'object' && decoded !== null && '_id' in decoded) {
        const user = await UserModel.findById(decoded._id);
        if (!user) {
            res.status(401).json({
                message: 'Unauthorized',
                data: null,
                errors: null,
            });
            return;
        }

        req.user = user;
        next();
        return;
    }

    res.status(401).json({
        message: 'Unauthorized',
        data: null,
        errors: null,
    });
};

export default authenticate;
