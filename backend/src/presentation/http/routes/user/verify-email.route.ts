import type { Router } from 'express';
import { type VerifyEmailDeps, verifyEmailHandler } from '../../handlers/user/verify-email.handler.js';

export const verifyEmailRoute = (router: Router, deps: VerifyEmailDeps) => {
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
    router.post('/users/verify-email', verifyEmailHandler(deps));
};
