import type { Router } from 'express';
import type { RefreshUseCase } from '../../../../application/auth/refresh.use-case.js';
import type { Request, Response } from 'express';
import { setAuthCookies } from '../../helpers/cookies.js';
import type { ApiSuccess } from '@shared/api/api-response.js';
import { refreshSchema } from '../../../schemas/auth.schemas.js';
import { InvalidRefreshTokenError } from '../../errors/invalid-refresh-token.error.js';
import { validateOrThrow } from '../../helpers/validate.js';

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
        const { cookies } = validateOrThrow(req, refreshSchema());

        const result = await refreshUseCase.execute({ refreshToken: cookies.refreshToken }, req.logger);
        if (!result.success) {
            switch (result.error) {
                case 'MISSING_REFRESH_TOKEN':
                case 'REFRESH_TOKEN_NOT_FOUND':
                case 'EXPIRED_REFRESH_TOKEN':
                    throw new InvalidRefreshTokenError();
            }
        }
        const { accessToken, refreshToken } = result.data;

        setAuthCookies(res, accessToken, refreshToken, cookies.rememberMe);

        const response: ApiSuccess = {
            success: true,
        };
        res.status(200).json(response);
    };
};
