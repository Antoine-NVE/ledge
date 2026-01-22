import type { Router } from 'express';
import type { LogoutUseCase } from '../../../../application/auth/logout.use-case.js';
import { logoutHandler } from '../../handlers/auth/logout.handler.js';

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
