import type { RefreshUseCase } from '../../../../application/auth/refresh.use-case.js';
import type { Router } from 'express';
import { refreshHandler } from '../../handlers/auth/refresh.handler.js';

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
