import type { VerifyEmailUseCase } from '../../../../application/user/verify-email.use-case.js';
import type { Router } from 'express';
import { verifyEmailHandler } from '../../handlers/user/verify-email.handler.js';

type Deps = {
    verifyEmailUseCase: VerifyEmailUseCase;
};

export const verifyEmailRoute = (router: Router, deps: Deps) => {
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
