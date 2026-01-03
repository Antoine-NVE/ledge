import type { Request, Response } from 'express';
import { removePasswordHash } from '../../../core/utils/clean.js';
import type { RequestEmailVerificationUseCase } from '../../../application/user/request-email-verification-use-case.js';
import type { VerifyEmailUseCase } from '../../../application/user/verify-email-use-case.js';
import type { TokenManager } from '../../../application/ports/token-manager.js';
import type { GetCurrentUserUseCase } from '../../../application/user/get-current-user-use-case.js';
import type { ApiSuccess } from '../../types/api.js';
import type { User } from '../../../domain/user/user-types.js';
import { AuthenticatedController } from './authenticated-controller.js';
import { sendVerificationEmailBodySchemaFactory, verifyEmailBodySchema } from '../schemas/user-schemas.js';

export class UserController extends AuthenticatedController {
    constructor(
        tokenManager: TokenManager,
        private requestEmailVerificationUseCase: RequestEmailVerificationUseCase,
        private verifyEmailUseCase: VerifyEmailUseCase,
        private getCurrentUserUseCase: GetCurrentUserUseCase,
        private allowedOrigins: string[],
    ) {
        super(tokenManager);
    }

    sendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
        const userId = this.getUserId(req);

        const { frontendBaseUrl } = this.validate(
            sendVerificationEmailBodySchemaFactory(this.allowedOrigins),
            req.body,
        );

        const result = await this.requestEmailVerificationUseCase.execute({ userId, frontendBaseUrl });
        if (!result.success) throw result.error;

        const response: ApiSuccess<void> = {
            success: true,
            code: 'OK',
            message: 'Verification email sent successfully',
        };
        res.status(200).json(response);
    };

    verifyEmail = async (req: Request, res: Response): Promise<void> => {
        const { token } = this.validate(verifyEmailBodySchema, req.body);

        const result = await this.verifyEmailUseCase.execute({ emailVerificationToken: token });
        if (!result.success) throw result.error;

        const response: ApiSuccess<void> = {
            success: true,
            code: 'OK',
            message: 'Email verified successfully',
        };
        res.status(200).json(response);
    };

    me = async (req: Request, res: Response): Promise<void> => {
        const userId = this.getUserId(req);

        const result = await this.getCurrentUserUseCase.execute({ userId });
        if (!result.success) throw result.error;
        const { user } = result.data;

        const response: ApiSuccess<{ user: Omit<User, 'passwordHash'> }> = {
            success: true,
            code: 'OK',
            message: 'User retrieved successfully',
            data: {
                user: removePasswordHash(user),
            },
        };
        res.status(200).json(response);
    };
}
