import { NextFunction, Request, Response } from 'express';
import UserModel, { UserDocument } from '../models/User';
import { AuthCookieService } from '../services/AuthCookieService';
import { JwtService } from '../services/JwtService';
import { env } from '../config/env';

// Extend Express Request interface to include userId
declare module 'express-serve-static-core' {
    interface Request {
        user?: UserDocument;
    }
}

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authCookieService = new AuthCookieService(req, res);
    const accessToken = authCookieService.getAccessTokenCookie();

    if (!accessToken) {
        res.status(401).json({
            message: 'Unauthorized',
            data: null,
            errors: null,
        });
        return;
    }

    const jwtService = new JwtService(env.JWT_SECRET!);
    const decoded = jwtService.verifyAccessJwt(accessToken);
    if (decoded) {
        const user = await UserModel.findById(decoded.sub);
        if (!user) {
            authCookieService.clearAccessTokenCookie();
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

    authCookieService.clearAccessTokenCookie();
    res.status(401).json({
        message: 'Unauthorized',
        data: null,
        errors: null,
    });
};

export default authenticate;
