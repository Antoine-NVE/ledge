import type { Router } from 'express';
import type { Request, Response } from 'express';
import type { LogoutUseCase } from '../../../../application/auth/logout.use-case.js';
import { clearAuthCookies } from '../../helpers/auth-cookies.js';
import type { ApiError, ApiSuccess } from '@shared/api/api-response.js';
import { logoutSchema } from '../../../schemas/auth.schemas.js';
import { treeifyError } from 'zod';

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
        const validation = logoutSchema().safeParse(req);
        if (!validation.success) {
            const response: ApiError = {
                success: false,
                code: 'BAD_REQUEST',
                tree: treeifyError(validation.error),
            };
            res.status(400).json(response);
            return;
        }
        const {
            cookies: { refreshToken },
        } = validation.data;

        clearAuthCookies(res);

        if (refreshToken) await logoutUseCase.execute({ refreshToken }, req.logger);

        const response: ApiSuccess = {
            success: true,
        };
        res.status(200).json(response);
    };
};
