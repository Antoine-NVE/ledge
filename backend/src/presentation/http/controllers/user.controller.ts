import type { Request, Response } from 'express';
import type { RequestEmailVerificationUseCase } from '../../../application/user/request-email-verification.use-case.js';
import type { VerifyEmailUseCase } from '../../../application/user/verify-email.use-case.js';
import type { TokenManager } from '../../../domain/ports/token-manager.js';
import type { GetCurrentUserUseCase } from '../../../application/user/get-current-user.use-case.js';
import type { ApiSuccess } from '../../types/api-response.js';
import { AuthenticatedController } from './authenticated.controller.js';
import { requestEmailVerificationSchema, verifyEmailSchema } from '../../schemas/user.schemas.js';
import type { MeDto } from '../../dto/user/me.dto.js';
import { toMeDto } from '../../mappers/user/me.mapper.js';

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

    requestEmailVerification = async (req: Request, res: Response): Promise<void> => {
        const userId = this.getUserId(req);

        const { body } = this.validate(req, requestEmailVerificationSchema(this.allowedOrigins));

        await this.requestEmailVerificationUseCase.execute({ userId, ...body });

        const response: ApiSuccess = {
            success: true,
        };
        res.status(200).json(response);
    };

    verifyEmail = async (req: Request, res: Response): Promise<void> => {
        const { body } = this.validate(req, verifyEmailSchema());

        await this.verifyEmailUseCase.execute({ emailVerificationToken: body.token });

        const response: ApiSuccess = {
            success: true,
        };
        res.status(200).json(response);
    };

    me = async (req: Request, res: Response): Promise<void> => {
        const userId = this.getUserId(req);

        const { user } = await this.getCurrentUserUseCase.execute({ userId });

        const response: ApiSuccess<MeDto> = {
            success: true,
            data: toMeDto(user),
        };
        res.status(200).json(response);
    };
}
