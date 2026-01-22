import type { Router } from 'express';
import { type RegisterDeps, registerHandler } from '../../handlers/auth/register.handler.js';

export const registerRoute = (router: Router, deps: RegisterDeps) => {
    /**
     * @openapi
     * /auth/register:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Register
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *               - confirmPassword
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               confirmPassword:
     *                 type: string
     *     responses:
     *       201:
     *         description: User registered successfully
     *       400:
     *         description: Validation error
     *       409:
     *         description: Email already exists
     *       500:
     *         description: Internal server error
     */
    router.post('/auth/register', registerHandler(deps));
};
