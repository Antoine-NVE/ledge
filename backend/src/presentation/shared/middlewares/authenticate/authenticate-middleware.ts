import { NextFunction, Request, Response } from 'express';
import { UserService } from '../../../../domain/user/user-service';
import { JwtService } from '../../../../infrastructure/services/jwt-service';
import { CookieService } from '../../../../infrastructure/services/cookie-service';
import { UnauthorizedError } from '../../../../infrastructure/errors/unauthorized-error';
import { User } from '../../../../domain/user/user-types';

declare module 'express-serve-static-core' {
    interface Request {
        user: User;
    }
}

export const authenticate =
    (jwtService: JwtService, userService: UserService) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const cookieService = new CookieService(req, res);
        const accessToken = cookieService.getAccessToken();
        if (!accessToken) {
            throw new UnauthorizedError('Required access token', undefined, {
                action: 'refresh',
            });
        }

        const { sub } = jwtService.verifyAccess(accessToken);
        const user = await userService.findOneById(sub);

        req.user = user;
        next();
    };
