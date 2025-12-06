import { NextFunction, Request, Response } from 'express';
import { User } from '../../../../../domain/user/user-types';
import { TokenManager } from '../../../../../application/ports/token-manager';
import { UserService } from '../../../../../domain/user/user-service';
import { CookieManager } from '../../../support/cookie-manager';
import { UnauthorizedError } from '../../../../../core/errors/unauthorized-error';
import { NotFoundError } from '../../../../../core/errors/not-found-error';

declare module 'express-serve-static-core' {
    interface Request {
        user: User;
    }
}

export type Authenticate = ReturnType<typeof createAuthenticate>;

export const createAuthenticate = ({
    tokenManager,
    userService,
    cookieManager,
}: {
    tokenManager: TokenManager;
    userService: UserService;
    cookieManager: CookieManager;
}) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = cookieManager.getAccessToken(req);
        if (!accessToken) {
            throw new UnauthorizedError('Required access token');
        }

        const { userId } = tokenManager.verifyAccess(accessToken);
        req.user = await userService
            .findById({ id: userId })
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
