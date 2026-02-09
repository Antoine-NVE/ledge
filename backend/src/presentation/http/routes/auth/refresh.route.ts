import type { Router } from 'express';
import type { RefreshUseCase } from '../../../../application/auth/refresh.use-case.js';
import type { Request, Response } from 'express';
import { setAuthCookies } from '../../helpers/auth-cookies.js';
import type { ApiSuccess } from '@shared/api/api-response.js';
import { refreshSchema } from '../../../schemas/auth.schemas.js';
import { treeifyError } from 'zod';
import { BadRequestError } from '../../errors/bad-request.error.js';
import { InvalidRefreshTokenError } from '../../errors/invalid-refresh-token.error.js';

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
     *         description: Missing (cookies or database) or expired refresh token
     *       500:
     *         description: Internal server error
     */
    router.post('/auth/refresh', refreshHandler(deps));
};

export const refreshHandler = ({ refreshUseCase }: Deps) => {
    return async (req: Request, res: Response) => {
        const validation = refreshSchema().safeParse(req);
        if (!validation.success) throw new BadRequestError(treeifyError(validation.error));
        const { cookies } = validation.data;

        if (!cookies.refreshToken) throw new InvalidRefreshTokenError();

        const refresh = await refreshUseCase.execute({ refreshToken: cookies.refreshToken }, req.logger);
        if (!refresh.success) {
            switch (refresh.error) {
                case 'REFRESH_TOKEN_NOT_FOUND':
                case 'EXPIRED_REFRESH_TOKEN':
                    throw new InvalidRefreshTokenError();
            }
        }
        const { accessToken, refreshToken } = refresh.data;

        setAuthCookies(res, accessToken, refreshToken, cookies.rememberMe);

        const response: ApiSuccess = {
            success: true,
        };
        res.status(200).json(response);
    };
};
