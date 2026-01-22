import type { Router } from 'express';
import { type LoginDeps, loginHandler } from '../../handlers/auth/login.handler.js';

export const loginRoute = (router: Router, deps: LoginDeps) => {
    /**
     * @openapi
     * /auth/login:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Login
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *               - rememberMe
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               rememberMe:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: User logged in successfully
     *       400:
     *         description: Validation error
     *       401:
     *         description: Invalid credentials
     *       500:
     *         description: Internal server error
     */
    router.post('/auth/login', loginHandler(deps));
};
