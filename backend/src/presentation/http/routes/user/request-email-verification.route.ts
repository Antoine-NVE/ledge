import type { Router } from 'express';
import type { RequestEmailVerificationUseCase } from '../../../../application/user/request-email-verification.use-case.js';
import type { Request, Response } from 'express';
import { requestEmailVerificationSchema } from '../../../schemas/user.schemas.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { ApiError, ApiSuccess } from '@shared/api/api-response.js';
import { findAccessToken } from '../../helpers/auth-cookies.js';
import { treeifyError } from 'zod';

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
        const accessToken = findAccessToken(req);
        if (!accessToken) {
            const response: ApiError = {
                success: false,
                code: 'UNAUTHORIZED',
            };
            res.status(401).json(response);
            return;
        }

        const verification = tokenManager.verifyAccess(accessToken);
        if (!verification.success) {
            const response: ApiError = {
                success: false,
                code: 'UNAUTHORIZED',
            };
            res.status(401).json(response);
            return;
        }
        const { userId } = verification.data;

        const validation = requestEmailVerificationSchema(allowedOrigins).safeParse(req);
        if (!validation.success) {
            const response: ApiError = {
                success: false,
                code: 'VALIDATION_ERROR',
                tree: treeifyError(validation.error),
            };
            res.status(400).json(response);
            return;
        }
        const { body } = validation.data;

        const requesting = await requestEmailVerificationUseCase.execute({ userId, ...body });
        if (!requesting.success) {
            switch (requesting.error.type) {
                case 'USER_NOT_FOUND': {
                    const response: ApiError = {
                        success: false,
                        code: 'UNAUTHORIZED',
                    };
                    res.status(401).json(response);
                    return;
                }
                case 'ACTIVE_COOLDOWN': {
                    const response: ApiError = {
                        success: false,
                        code: 'ACTIVE_COOLDOWN',
                    };
                    res.status(409).json(response);
                    return;
                }
                case 'EMAIL_ALREADY_VERIFIED': {
                    const response: ApiError = {
                        success: false,
                        code: 'EMAIL_ALREADY_VERIFIED',
                    };
                    res.status(409).json(response);
                    return;
                }
            }
        }

        const response: ApiSuccess = {
            success: true,
        };
        res.status(200).json(response);
    };
};
