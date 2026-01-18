import type { Request, Response } from 'express';
import { removePasswordHash } from '../../../core/utils/clean.js';
import type { RequestEmailVerificationUseCase } from '../../../application/user/request-email-verification-use-case.js';
import type { VerifyEmailUseCase } from '../../../application/user/verify-email-use-case.js';
import type { TokenManager } from '../../../application/ports/token-manager.js';
import type { GetCurrentUserUseCase } from '../../../application/user/get-current-user-use-case.js';
import type { ApiError, ApiSuccess } from '../../types/api.js';
import type { User } from '../../../domain/user/user.js';
import { AuthenticatedController } from './authenticated-controller.js';
import { requestEmailVerificationSchema, verifyEmailSchema } from '../schemas/user-schemas.js';
import { ValidationError } from '../../errors/validation.error.js';
import { AuthenticationError } from '../../../application/errors/authentication.error.js';
import { BusinessRuleError } from '../../../application/errors/business-rule.error.js';

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
        try {
            const userId = this.getUserId(req);

            const { body } = this.validate(req, requestEmailVerificationSchema(this.allowedOrigins));

            await this.requestEmailVerificationUseCase.execute({ userId, ...body });

            const response: ApiSuccess<void> = {
                success: true,
                code: 'OK',
                message: 'Verification email sent successfully',
            };
            res.status(200).json(response);
        } catch (err: unknown) {
            if (err instanceof ValidationError) {
                const response: ApiError = {
                    success: false,
                    code: 'BAD_REQUEST',
                    message: 'Invalid data',
                    issues: err.issues,
                };
                res.status(400).json(response);
                return;
            }
            if (err instanceof AuthenticationError) {
                const response: ApiError = {
                    success: false,
                    code: 'UNAUTHORIZED',
                    message: 'Please login',
                };
                res.status(401).json(response);
                return;
            }
            if (err instanceof BusinessRuleError && err.reason === 'EMAIL_ALREADY_VERIFIED') {
                const response: ApiError = {
                    success: false,
                    code: 'CONFLICT',
                    message: 'Email already verified',
                };
                res.status(409).json(response);
                return;
            }
            if (err instanceof BusinessRuleError && err.reason === 'ACTIVE_COOLDOWN') {
                const response: ApiError = {
                    success: false,
                    code: 'TOO_MANY_REQUESTS',
                    message: 'Please wait before requesting another email verification',
                };
                res.status(409).json(response);
                return;
            }
            throw err;
        }
    };

    verifyEmail = async (req: Request, res: Response): Promise<void> => {
        try {
            const { body } = this.validate(req, verifyEmailSchema);

            await this.verifyEmailUseCase.execute({ emailVerificationToken: body.token });

            const response: ApiSuccess<void> = {
                success: true,
                code: 'OK',
                message: 'Email verified successfully',
            };
            res.status(200).json(response);
        } catch (err: unknown) {
            if (err instanceof ValidationError) {
                const response: ApiError = {
                    success: false,
                    code: 'BAD_REQUEST',
                    message: 'Invalid data',
                    issues: err.issues,
                };
                res.status(400).json(response);
                return;
            }
            if (err instanceof BusinessRuleError && err.reason === 'INVALID_TOKEN') {
                const response: ApiError = {
                    success: false,
                    code: 'BAD_REQUEST',
                    message: 'Invalid token',
                };
                res.status(400).json(response);
                return;
            }
            if (err instanceof BusinessRuleError && err.reason === 'EMAIL_ALREADY_VERIFIED') {
                const response: ApiError = {
                    success: false,
                    code: 'CONFLICT',
                    message: 'Email already verified',
                };
                res.status(409).json(response);
                return;
            }
            throw err;
        }
    };

    me = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = this.getUserId(req);

            const { user } = await this.getCurrentUserUseCase.execute({ userId });

            const response: ApiSuccess<{ user: Omit<User, 'passwordHash'> }> = {
                success: true,
                code: 'OK',
                message: 'User retrieved successfully',
                data: {
                    user: removePasswordHash(user),
                },
            };
            res.status(200).json(response);
        } catch (err: unknown) {
            if (err instanceof AuthenticationError) {
                const response: ApiError = {
                    success: false,
                    code: 'UNAUTHORIZED',
                    message: 'Please login',
                };
                res.status(401).json(response);
                return;
            }
            throw err;
        }
    };
}
