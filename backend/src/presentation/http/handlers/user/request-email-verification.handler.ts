import type { RequestEmailVerificationUseCase } from '../../../../application/user/request-email-verification.use-case.js';
import type { Request, Response } from 'express';
import { requestEmailVerificationSchema } from '../../../schemas/user.schemas.js';
import type { ApiSuccess } from '../../../types/api-response.js';
import { getAuthenticatedUserId } from '../../helpers/auth.js';
import { validateRequest } from '../../helpers/validate-request.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';

type Deps = {
    requestEmailVerificationUseCase: RequestEmailVerificationUseCase;
    tokenManager: TokenManager;
    allowedOrigins: string[];
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
