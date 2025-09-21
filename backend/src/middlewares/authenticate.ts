import { NextFunction, Request, Response } from 'express';
import UserModel, { UserDocument } from '../models/User';
import { clearAccessTokenCookie, getAccessTokenCookie } from '../services/cookie';
import { verifyAccessJwt } from '../services/jwt';

// Extend Express Request interface to include userId
declare module 'express-serve-static-core' {
    interface Request {
        user?: UserDocument;
    }
}

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const access_token = getAccessTokenCookie(req);

    if (!access_token) {
        res.status(401).json({
            message: 'Unauthorized',
            data: null,
            errors: null,
        });
        return;
    }

    const decoded = verifyAccessJwt(access_token, process.env.JWT_SECRET!);
    if (decoded) {
        const user = await UserModel.findById(decoded.sub);
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
