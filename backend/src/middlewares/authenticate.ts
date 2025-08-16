import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../utils/jwt';
import UserModel, { UserDocument } from '../models/User';
import { clearAccessTokenCookie } from '../services/authCookie';

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

    const decoded = verifyJwt(access_token);
    if (decoded) {
        const user = await UserModel.findById(decoded._id);
        if (!user) {
            clearAccessTokenCookie(res);
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

    clearAccessTokenCookie(res);
    res.status(401).json({
        message: 'Unauthorized',
        data: null,
        errors: null,
    });
};

export default authenticate;
