import type { NextFunction, Request, Response } from 'express';
import type { User } from '../../../../../domain/user/user-types.js';
import type { TokenManager } from '../../../../../application/ports/token-manager.js';
import { UserService } from '../../../../../domain/user/user-service';
import { CookieManager } from '../../../support/cookie-manager.js';
import { UnauthorizedError } from '../../../../../core/errors/unauthorized-error.js';
import { NotFoundError } from '../../../../../core/errors/not-found-error.js';

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
            throw new UnauthorizedError({
                message: 'Required access token',
                action: 'REFRESH',
            });
        }

        const { userId } = tokenManager.verifyAccess(accessToken);
        req.user = await userService.findById({ id: userId }).catch((err: unknown) => {
            if (err instanceof NotFoundError) {
                // If user is not found, refresh will probably don't work either
                throw new UnauthorizedError({ action: 'REFRESH' });
            }
            throw err;
        });
        next();
    };
};
