import type { Router } from 'express';
import type { Request, Response } from 'express';
import type { LogoutUseCase } from '../../../../application/auth/logout.use-case.js';
import { clearAuthCookies, findRefreshToken } from '../../helpers/auth-cookies.js';
import type { ApiSuccess } from '@shared/api/api-response.js';

type Deps = {
    logoutUseCase: LogoutUseCase;
};

export const logoutRoute = (router: Router, deps: Deps) => {
    /**
     * @openapi
     * /auth/logout:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Logout
     *     responses:
     *       200:
     *         description: User logged out successfully
     *       500:
     *         description: Internal server error
     */
    router.post('/auth/logout', logoutHandler(deps));
};

export const logoutHandler = ({ logoutUseCase }: Deps) => {
    return async (req: Request, res: Response) => {
        const refreshToken = findRefreshToken(req);

        clearAuthCookies(res);

        if (refreshToken) await logoutUseCase.execute({ refreshToken });

        const response: ApiSuccess = {
            success: true,
        };
        res.status(200).json(response);
    };
};
