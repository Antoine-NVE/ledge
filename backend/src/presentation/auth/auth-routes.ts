import express from 'express';
import { loginBodySchema, registerBodySchema } from './auth-schemas';
import { Container } from '../../infrastructure/types/container-type';
import { createValidateBody } from '../middlewares/business/validation/validate-body';

export const createAuthRoutes = (container: Container) => {
    const router = express.Router();

    const { register, login, refresh, logout } = container.authController;

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
    router.post('/register', createValidateBody(registerBodySchema), register);

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
    router.post('/login', createValidateBody(loginBodySchema), login);

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
    router.post('/refresh', refresh);

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
    router.post('/logout', logout);

    return router;
};
