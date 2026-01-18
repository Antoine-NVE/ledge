import type { Request, Response } from 'express';
import { removePasswordHash } from '../../../core/utils/clean.js';
import type { RegisterUseCase } from '../../../application/auth/register-use-case.js';
import type { LoginUseCase } from '../../../application/auth/login-use-case.js';
import type { RefreshUseCase } from '../../../application/auth/refresh-use-case.js';
import type { LogoutUseCase } from '../../../application/auth/logout-use-case.js';
import type { ApiError, ApiSuccess } from '../../types/api.js';
import type { User } from '../../../domain/entities/user.js';
import { BaseController } from './base-controller.js';
import { loginSchema, registerSchema } from '../schemas/auth-schemas.js';
import { AuthenticationError } from '../../../application/errors/authentication.error.js';
import { ValidationError } from '../../errors/validation.error.js';
import { BusinessRuleError } from '../../../application/errors/business-rule.error.js';

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
                code: 'CREATED',
                message: 'User registered successfully',
                data: {
                    user: removePasswordHash(user),
                },
            };
            res.status(201).json(response);
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
            if (err instanceof BusinessRuleError && err.reason === 'DUPLICATE_EMAIL') {
                const response: ApiError = {
                    success: false,
                    code: 'CONFLICT_ERROR',
                    message: 'Email already in use',
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
                code: 'OK',
                message: 'User logged in successfully',
                data: {
                    user: removePasswordHash(user),
                },
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
                    message: 'Invalid credentials',
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

            const response: ApiSuccess<void> = {
                success: true,
                code: 'OK',
                message: 'Tokens refreshed successfully',
            };
            res.status(200).json(response);
        } catch (err: unknown) {
            if (err instanceof AuthenticationError) {
                const response: ApiError = {
                    success: false,
                    code: 'UNAUTHORIZED',
                    message: 'Invalid refresh token',
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

        const response: ApiSuccess<void> = {
            success: true,
            code: 'OK',
            message: 'Logged out successfully',
        };
        res.status(200).json(response);
    };
}
