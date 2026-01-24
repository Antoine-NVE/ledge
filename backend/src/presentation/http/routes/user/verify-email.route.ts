import type { Router } from 'express';
import type { VerifyEmailUseCase } from '../../../../application/user/verify-email.use-case.js';
import type { Request, Response } from 'express';
import { verifyEmailSchema } from '../../../schemas/user.schemas.js';
import { validateRequest } from '../../helpers/validate-request.js';
import type { ApiSuccess } from '@shared/api/api-response.js';

type Deps = {
    verifyEmailUseCase: VerifyEmailUseCase;
};

export const verifyEmailRoute = (router: Router, deps: Deps) => {
    /**
     * @openapi
     * /users/verify-email:
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

export const verifyEmailHandler = ({ verifyEmailUseCase }: Deps) => {
    return async (req: Request, res: Response): Promise<void> => {
        const { body } = validateRequest(req, verifyEmailSchema());

        await verifyEmailUseCase.execute({ emailVerificationToken: body.token }, req.logger);

        const response: ApiSuccess = {
            success: true,
        };
        res.status(200).json(response);
    };
};
