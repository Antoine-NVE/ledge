import type { Router } from 'express';
import type { RefreshUseCase } from '../../../../application/auth/refresh.use-case.js';
import type { Request, Response } from 'express';
import { setAuthCookies } from '../../helpers/auth-cookies.js';
import type { ApiError, ApiSuccess } from '@shared/api/api-response.js';
import { refreshSchema } from '../../../schemas/auth.schemas.js';
import { treeifyError } from 'zod';

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
        if (!validation.success) {
            const response: ApiError = {
                success: false,
                code: 'BAD_REQUEST',
                tree: treeifyError(validation.error),
            };
            res.status(400).json(response);
            return;
        }
        const { cookies } = validation.data;

        if (!cookies.refreshToken) {
            const response: ApiError = {
                success: false,
                code: 'INVALID_REFRESH_TOKEN',
            };
            res.status(401).json(response);
            return;
        }

        const refresh = await refreshUseCase.execute({ refreshToken: cookies.refreshToken }, req.logger);
        if (!refresh.success) {
            switch (refresh.error.type) {
                case 'REFRESH_TOKEN_NOT_FOUND':
                case 'EXPIRED_REFRESH_TOKEN': {
                    const response: ApiError = {
                        success: false,
                        code: 'INVALID_REFRESH_TOKEN',
                    };
                    res.status(401).json(response);
                    return;
                }
            }
        }
        const { accessToken, newRefreshToken } = refresh.data;

        setAuthCookies(res, accessToken, newRefreshToken, cookies.rememberMe);

        const response: ApiSuccess = {
            success: true,
        };
        res.status(200).json(response);
    };
};
