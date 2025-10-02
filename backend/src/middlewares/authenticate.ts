import { NextFunction, Request, Response } from 'express';
import UserModel, { UserDocument } from '../models/User';
import { AuthCookieService } from '../services/AuthCookieService';
import { JwtService } from '../services/JwtService';
import { env } from '../config/env';
import { RequiredAccessTokenError } from '../errors/UnauthorizedError';
import { UserNotFoundError } from '../errors/NotFoundError';

// Extend Express Request interface to include userId
declare module 'express-serve-static-core' {
    interface Request {
        user?: UserDocument;
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authCookieService = new AuthCookieService(req, res);
    const accessToken = authCookieService.getAccessTokenCookie();

    if (!accessToken) throw new RequiredAccessTokenError();

    const jwtService = new JwtService(env.JWT_SECRET);
    const decoded = jwtService.verifyAccessJwt(accessToken);

    const user = await UserModel.findById(decoded.sub);
    if (!user) throw new UserNotFoundError();

    req.user = user;
    next();
};
