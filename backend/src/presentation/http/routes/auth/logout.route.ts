import type { Router } from 'express';
import { type LogoutDeps, logoutHandler } from '../../handlers/auth/logout.handler.js';

export const logoutRoute = (router: Router, deps: LogoutDeps) => {
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
