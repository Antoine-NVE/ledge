import type { Router } from 'express';
import { type MeDeps, meHandler } from '../../handlers/user/me.handler.js';

export const meRoute = (router: Router, deps: MeDeps) => {
    /**
     * @openapi
     * /users/me:
     *   get:
     *     tags:
     *       - User
     *     summary: Me
     *     responses:
     *       200:
     *         description: User retrieved successfully
     *       401:
     *         description: Required access token / User not found / Inactive, invalid or expired JWT
     *       500:
     *         description: Internal server error
     */
    router.get('/users/me', meHandler(deps));
};
