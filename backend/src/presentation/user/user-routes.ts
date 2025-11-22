import express from 'express';
import { validateBody } from '../shared/middlewares/validate-body/validate-body-middleware';
import {
    createSendVerificationEmailBodySchema,
    verifyEmailBodySchema,
} from './user-schemas';
import { authenticate } from '../shared/middlewares/authenticate/authenticate-middleware';
import { Container } from '../../infrastructure/types/container-type';
import { Env } from '../../infrastructure/types/env-type';

export const userRoutes = (container: Container, env: Env) => {
    const router = express.Router();

    const { jwtService, userService } = container;
    const { sendVerificationEmail, verifyEmail, me } = container.userController;
    const sendVerificationEmailBodySchema =
        createSendVerificationEmailBodySchema(env);

    /**
     * @openapi
     * /user/send-verification-email:
     *   post:
     *     tags:
     *       - User
     *     summary: Send verification email
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - frontendBaseUrl
     *             properties:
     *               frontendBaseUrl:
     *                 type: string
     *     responses:
     *       200:
     *         description: Verification email sent successfully
     *       400:
     *         description: Validation error / Invalid JWT payload
     *       401:
     *         description: Required access token / User not found / Inactive, invalid or expired JWT
     *       409:
     *         description: Email already verified
     *       429:
     *         description: Cooldown
     *       500:
     *         description: Internal server error
     */
    router.post(
        '/send-verification-email',
        authenticate(jwtService, userService),
        validateBody(sendVerificationEmailBodySchema),
        sendVerificationEmail,
    );

    /**
     * @openapi
     * /user/verify-email:
     *   post:
     *     tags:
     *       - User
     *     summary: Verify email
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - jwt
     *             properties:
     *               jwt:
     *                 type: string
     *     responses:
     *       200:
     *         description: Email verified successfully
     *       400:
     *         description: Validation error / Invalid JWT payload
     *       401:
     *         description: Inactive, invalid or expired JWT
     *       404:
     *         description: User not found
     *       409:
     *         description: Email already verified
     *       500:
     *         description: Internal server error
     */
    router.post(
        '/verify-email',
        validateBody(verifyEmailBodySchema),
        verifyEmail,
    );

    /**
     * @openapi
     * /user/me:
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
    router.get('/me', authenticate(jwtService, userService), me);

    return router;
};
