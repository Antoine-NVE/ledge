import type { Router } from 'express';
import type { RequestEmailVerificationUseCase } from '../../../../application/user/request-email-verification.use-case.js';
import type { Request, Response } from 'express';
import { requestEmailVerificationSchema } from '../../../schemas/user.schemas.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { ApiSuccess } from '@shared/api/api-response.js';
import { treeifyError } from 'zod';
import { BadRequestError } from '../../errors/bad-request.error.js';
import { UnauthorizedError } from '../../errors/unauthorized.error.js';
import { ActiveCooldownError } from '../../errors/active-cooldown.error.js';
import { EmailAlreadyVerifiedError } from '../../errors/email-already-verified.error.js';

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
        const validation = requestEmailVerificationSchema(allowedOrigins).safeParse(req);
        if (!validation.success) throw new BadRequestError(treeifyError(validation.error));
        const { body, cookies } = validation.data;

        if (!cookies.accessToken) throw new UnauthorizedError();

        const authentication = tokenManager.verifyAccess(cookies.accessToken);
        if (!authentication.success) throw new UnauthorizedError();
        const { userId } = authentication.data;

        const requesting = await requestEmailVerificationUseCase.execute({
            userId,
            frontendBaseUrl: body.frontendBaseUrl,
        });
        if (!requesting.success) {
            switch (requesting.error) {
                case 'USER_NOT_FOUND':
                    throw new UnauthorizedError();
                case 'ACTIVE_COOLDOWN':
                    throw new ActiveCooldownError();
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
