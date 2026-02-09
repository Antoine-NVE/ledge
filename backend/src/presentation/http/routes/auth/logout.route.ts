import type { Router } from 'express';
import type { Request, Response } from 'express';
import type { LogoutUseCase } from '../../../../application/auth/logout.use-case.js';
import { clearAuthCookies } from '../../helpers/cookies.js';
import type { ApiSuccess } from '@shared/api/api-response.js';
import { logoutSchema } from '../../../schemas/auth.schemas.js';
import { treeifyError } from 'zod';
import { BadRequestError } from '../../errors/bad-request.error.js';

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
        if (!validation.success) throw new BadRequestError(treeifyError(validation.error));
        const { cookies } = validation.data;

        clearAuthCookies(res);

        if (!cookies.refreshToken) {
            const response: ApiSuccess = {
                success: true,
            };
            res.status(200).json(response);
            return;
        }

        await logoutUseCase.execute({ refreshToken: cookies.refreshToken }, req.logger);

        const response: ApiSuccess = {
            success: true,
        };
        res.status(200).json(response);
    };
};
