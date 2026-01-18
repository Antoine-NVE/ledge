import express from 'express';
import type { UserController } from '../controllers/user.controller.js';

export const createUserRoutes = (userController: UserController) => {
    const router = express.Router();

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
    router.post('/request-email-verification', userController.requestEmailVerification);

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
    router.post('/verify-email', userController.verifyEmail);

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
    router.get('/me', userController.me);

    return router;
};
