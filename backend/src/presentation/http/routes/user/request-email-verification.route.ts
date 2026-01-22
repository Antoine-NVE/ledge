import type { Router } from 'express';
import {
    type RequestEmailVerificationDeps,
    requestEmailVerificationHandler,
} from '../../handlers/user/request-email-verification.handler.js';

export const requestEmailVerificationRoute = (router: Router, deps: RequestEmailVerificationDeps) => {
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
    router.post('/users/request-email-verification', requestEmailVerificationHandler(deps));
};
