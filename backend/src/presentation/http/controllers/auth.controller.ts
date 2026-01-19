import type { Request, Response } from 'express';
import { removePasswordHash } from '../../../core/utils/clean.js';
import type { RegisterUseCase } from '../../../application/auth/register.use-case.js';
import type { LoginUseCase } from '../../../application/auth/login.use-case.js';
import type { RefreshUseCase } from '../../../application/auth/refresh.use-case.js';
import type { LogoutUseCase } from '../../../application/auth/logout.use-case.js';
import type { ApiError, ApiSuccess } from '../../types/api-response.js';
import type { User } from '../../../domain/entities/user.js';
import { BaseController } from './base.controller.js';
import { loginSchema, registerSchema } from '../schemas/auth.schemas.js';
import { AuthenticationError } from '../../../application/errors/authentication.error.js';
import { ValidationError } from '../../errors/validation.error.js';
import { BusinessRuleError } from '../../../application/errors/business-rule.error.js';
import z from 'zod';

export class AuthController extends BaseController {
    constructor(
        private registerUseCase: RegisterUseCase,
        private loginUseCase: LoginUseCase,
        private refreshUseCase: RefreshUseCase,
        private logoutUseCase: LogoutUseCase,
    ) {
        super();
    }

    register = async (req: Request, res: Response) => {
        try {
            const { body } = this.validate(req, registerSchema);

            const { user, accessToken, refreshToken } = await this.registerUseCase.execute(body);

            this.setAuthCookies(res, accessToken, refreshToken, false);

            const response: ApiSuccess<{ user: Omit<User, 'passwordHash'> }> = {
                success: true,
                data: {
                    user: removePasswordHash(user),
                },
            };
            res.status(201).json(response);
        } catch (err: unknown) {
            if (err instanceof ValidationError) {
                const response: ApiError<z.infer<typeof registerSchema>> = {
                    success: false,
                    code: 'VALIDATION_ERROR',
                    tree: err.tree,
                };
                res.status(400).json(response);
                return;
            }
            if (err instanceof BusinessRuleError && err.reason === 'DUPLICATE_EMAIL') {
                const response: ApiError = {
                    success: false,
                    code: 'BUSINESS_RULE_ERROR',
                    reason: err.reason,
                };
                res.status(409).json(response);
                return;
            }
            throw err;
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const { body } = this.validate(req, loginSchema);

            const { user, accessToken, refreshToken } = await this.loginUseCase.execute(body);

            this.setAuthCookies(res, accessToken, refreshToken, body.rememberMe);

            const response: ApiSuccess<{ user: Omit<User, 'passwordHash'> }> = {
                success: true,
                data: {
                    user: removePasswordHash(user),
                },
            };
            res.status(200).json(response);
        } catch (err: unknown) {
            if (err instanceof ValidationError) {
                const response: ApiError<z.infer<typeof loginSchema>> = {
                    success: false,
                    code: 'VALIDATION_ERROR',
                    tree: err.tree,
                };
                res.status(400).json(response);
                return;
            }
            if (err instanceof AuthenticationError) {
                const response: ApiError = {
                    success: false,
                    code: 'AUTHENTICATION_ERROR',
                };
                res.status(401).json(response);
                return;
            }
            throw err;
        }
    };

    refresh = async (req: Request, res: Response) => {
        try {
            const refreshToken = this.findRefreshToken(req);
            if (!refreshToken) throw new AuthenticationError();

            const rememberMe = this.findRememberMe(req);

            const { accessToken, newRefreshToken } = await this.refreshUseCase.execute({ refreshToken });

            this.setAuthCookies(res, accessToken, newRefreshToken, rememberMe);

            const response: ApiSuccess = {
                success: true,
            };
            res.status(200).json(response);
        } catch (err: unknown) {
            if (err instanceof AuthenticationError) {
                const response: ApiError = {
                    success: false,
                    code: 'AUTHENTICATION_ERROR',
                };
                res.status(401).json(response);
                return;
            }
            throw err;
        }
    };

    logout = async (req: Request, res: Response) => {
        const refreshToken = this.findRefreshToken(req);

        this.clearAuthCookies(res);

        if (refreshToken) await this.logoutUseCase.execute({ refreshToken });

        const response: ApiSuccess = {
            success: true,
        };
        res.status(200).json(response);
    };
}
