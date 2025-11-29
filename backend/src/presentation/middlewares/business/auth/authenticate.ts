import { NextFunction, Request, Response } from 'express';
import { UserService } from '../../../../domain/user/user-service';
import { CookieService } from '../../../../infrastructure/adapters/cookie-service';
import { UnauthorizedError } from '../../../../infrastructure/errors/unauthorized-error';
import { User } from '../../../../domain/user/user-types';
import { NotFoundError } from '../../../../infrastructure/errors/not-found-error';
import { TokenManager } from '../../../../application/ports/token-manager';

declare module 'express-serve-static-core' {
    interface Request {
        user: User;
    }
}

export type Authenticate = ReturnType<typeof createAuthenticate>;

export const createAuthenticate = (
    tokenManager: TokenManager,
    userService: UserService,
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const cookieService = new CookieService(req, res);
        const accessToken = cookieService.getAccessToken();
        if (!accessToken) {
            throw new UnauthorizedError('Required access token', undefined, {
                action: 'refresh',
            });
        }

        const userId = tokenManager.verifyAccess(accessToken);
        req.user = await userService
            .findOneById(userId)
            .catch((err: unknown) => {
                if (err instanceof NotFoundError) {
                    // If user is not found, refresh will probably don't work either
                    throw new UnauthorizedError();
                }
                throw err;
            });
        next();
    };
};
