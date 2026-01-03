import type { Request, Response } from 'express';
import { removePasswordHash } from '../../../core/utils/clean.js';
import type { RegisterUseCase } from '../../../application/auth/register-use-case.js';
import type { LoginUseCase } from '../../../application/auth/login-use-case.js';
import type { RefreshUseCase } from '../../../application/auth/refresh-use-case.js';
import type { LogoutUseCase } from '../../../application/auth/logout-use-case.js';
import type { ApiSuccess } from '../../types/api.js';
import type { User } from '../../../domain/user/user-types.js';
import { BaseController } from './base-controller.js';
import { loginBodySchema, registerBodySchema } from '../schemas/auth-schemas.js';

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
        const { email, password } = this.validate(registerBodySchema, req.body);

        const result = await this.registerUseCase.execute({ email, password });
        if (!result.success) throw result.error;
        const { user, accessToken, refreshToken } = result.data;

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
    };

    login = async (req: Request, res: Response) => {
        const { email, password, rememberMe } = this.validate(loginBodySchema, req.body);

        const result = await this.loginUseCase.execute({ email, password });
        if (!result.success) throw result.error;
        const { user, accessToken, refreshToken } = result.data;

        this.setAuthCookies(res, accessToken, refreshToken, rememberMe);

        const response: ApiSuccess<{ user: Omit<User, 'passwordHash'> }> = {
            success: true,
            code: 'OK',
            message: 'User logged in successfully',
            data: {
                user: removePasswordHash(user),
            },
        };
        res.status(200).json(response);
    };

    refresh = async (req: Request, res: Response) => {
        const refreshToken = this.getRefreshToken(req);
        const rememberMe = this.getRememberMe(req);

        const result = await this.refreshUseCase.execute({ refreshToken });
        if (!result.success) throw result.error;
        const data = result.data;

        this.setAuthCookies(res, data.accessToken, data.refreshToken, rememberMe);

        const response: ApiSuccess<void> = {
            success: true,
            code: 'OK',
            message: 'Tokens refreshed successfully',
        };
        res.status(200).json(response);
    };

    logout = async (req: Request, res: Response) => {
        const refreshToken = this.findRefreshToken(req);

        this.clearAuthCookies(res);

        if (refreshToken) {
            const result = await this.logoutUseCase.execute({ refreshToken });
            if (!result.success) throw result.error;
        }

        res.status(204).json();
    };
}
