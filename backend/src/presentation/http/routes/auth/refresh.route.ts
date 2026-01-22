import type { Router } from 'express';
import { type RefreshDeps, refreshHandler } from '../../handlers/auth/refresh.handler.js';

export const refreshRoute = (router: Router, deps: RefreshDeps) => {
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
