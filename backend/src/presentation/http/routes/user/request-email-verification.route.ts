import type { Router } from 'express';
import type { RequestEmailVerificationUseCase } from '../../../../application/user/request-email-verification.use-case.js';
import type { Request, Response } from 'express';
import { requestEmailVerificationSchema } from '../../../schemas/user.schemas.js';
import { getAuthenticatedUserId } from '../../helpers/auth.js';
import { validateRequest } from '../../helpers/validate-request.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { ApiSuccess } from '@shared/api/api-response.js';

type Deps = {
    requestEmailVerificationUseCase: RequestEmailVerificationUseCase;
    tokenManager: TokenManager;
    allowedOrigins: string[];
};

export const requestEmailVerificationRoute = (router: Router, deps: Deps) => {
    /**
     * @openapi
     * /users/request-email-verification:
     *   post:
     *     tags:
     *       - User
     *     summary: Request email verification
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
     *         description: Validation error
     *       401:
     *         description: Authentication error
     *       409:
     *         description: Email already verified
     *       429:
     *         description: Active cooldown
     *       500:
     *         description: Internal server error
     */
    router.post('/users/request-email-verification', requestEmailVerificationHandler(deps));
};

export const requestEmailVerificationHandler = ({
    requestEmailVerificationUseCase,
    tokenManager,
    allowedOrigins,
}: Deps) => {
    return async (req: Request, res: Response): Promise<void> => {
        const userId = getAuthenticatedUserId(req, tokenManager);

        const { body } = validateRequest(req, requestEmailVerificationSchema(allowedOrigins));

        await requestEmailVerificationUseCase.execute({ userId, ...body });

        const response: ApiSuccess = {
            success: true,
        };
        res.status(200).json(response);
    };
};
