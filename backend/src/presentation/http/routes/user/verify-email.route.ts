import type { Router } from 'express';
import type { VerifyEmailUseCase } from '../../../../application/user/verify-email.use-case.js';
import type { Request, Response } from 'express';
import { verifyEmailSchema } from '../../../schemas/user.schemas.js';
import type { ApiSuccess } from '@shared/api/api-response.js';
import { InvalidTokenError } from '../../errors/invalid-token.error.js';
import { EmailAlreadyVerifiedError } from '../../errors/email-already-verified.error.js';
import { validateOrThrow } from '../../helpers/validate.js';

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
     *         description: Validation error or invalid token
     *       409:
     *         description: Email already verified
     *       500:
     *         description: Internal server error
     */
    router.post('/users/verify-email', verifyEmailHandler(deps));
};

export const verifyEmailHandler = ({ verifyEmailUseCase }: Deps) => {
    return async (req: Request, res: Response): Promise<void> => {
        const { body } = validateOrThrow(req, verifyEmailSchema());

        const result = await verifyEmailUseCase.execute(
            { emailVerificationToken: body.emailVerificationToken },
            req.logger,
        );
        if (!result.success) {
            switch (result.error) {
                case 'INACTIVE_TOKEN':
                case 'INVALID_TOKEN':
                case 'EXPIRED_TOKEN':
                case 'USER_NOT_FOUND':
                    throw new InvalidTokenError();
                case 'EMAIL_ALREADY_VERIFIED':
                    throw new EmailAlreadyVerifiedError();
            }
        }

        const response: ApiSuccess = {
            success: true,
        };
        res.status(200).json(response);
    };
};
