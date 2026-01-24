import type { Router } from 'express';
import type { RefreshUseCase } from '../../../../application/auth/refresh.use-case.js';
import type { Request, Response } from 'express';
import { AuthenticationError } from '../../../../application/errors/authentication.error.js';
import { findRefreshToken, findRememberMe, setAuthCookies } from '../../helpers/auth-cookies.js';
import type { ApiSuccess } from '@shared/api/api-response.js';

type Deps = {
    refreshUseCase: RefreshUseCase;
};

export const refreshRoute = (router: Router, deps: Deps) => {
    /**
     * @openapi
     * /auth/refresh:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Refresh
     *     responses:
     *       200:
     *         description: Tokens refreshed successfully
     *       401:
     *         description: Required, invalid or expired refresh token
     *       500:
     *         description: Internal server error
     */
    router.post('/auth/refresh', refreshHandler(deps));
};

export const refreshHandler = ({ refreshUseCase }: Deps) => {
    return async (req: Request, res: Response) => {
        const refreshToken = findRefreshToken(req);
        if (!refreshToken) throw new AuthenticationError();

        const rememberMe = findRememberMe(req);

        const output = await refreshUseCase.execute({ refreshToken });

        setAuthCookies(res, output.accessToken, output.refreshToken, rememberMe);

        const response: ApiSuccess = {
            success: true,
        };
        res.status(200).json(response);
    };
};
