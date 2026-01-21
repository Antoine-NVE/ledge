import type { Request, Response } from 'express';
import type { RegisterUseCase } from '../../../application/auth/register.use-case.js';
import type { LoginUseCase } from '../../../application/auth/login.use-case.js';
import type { RefreshUseCase } from '../../../application/auth/refresh.use-case.js';
import type { LogoutUseCase } from '../../../application/auth/logout.use-case.js';
import type { ApiSuccess } from '../../types/api-response.js';
import { BaseController } from './base.controller.js';
import { AuthenticationError } from '../../../application/errors/authentication.error.js';
import { loginSchema, registerSchema } from '../../schemas/auth.schemas.js';
import type { RegisterDto } from '../../dto/auth/register.dto.js';
import { toRegisterDto } from '../../mappers/auth/register.mapper.js';
import type { LoginDto } from '../../dto/auth/login.dto.js';
import { toLoginDto } from '../../mappers/auth/login.mapper.js';

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
        const { body } = this.validate(req, registerSchema());

        const { user, accessToken, refreshToken } = await this.registerUseCase.execute(body);

        this.setAuthCookies(res, accessToken, refreshToken, false);

        const response: ApiSuccess<RegisterDto> = {
            success: true,
            data: toRegisterDto(user),
        };
        res.status(201).json(response);
    };

    login = async (req: Request, res: Response) => {
        const { body } = this.validate(req, loginSchema());

        const { user, accessToken, refreshToken } = await this.loginUseCase.execute(body);

        this.setAuthCookies(res, accessToken, refreshToken, body.rememberMe);

        const response: ApiSuccess<LoginDto> = {
            success: true,
            data: toLoginDto(user),
        };
        res.status(200).json(response);
    };

    refresh = async (req: Request, res: Response) => {
        const refreshToken = this.findRefreshToken(req);
        if (!refreshToken) throw new AuthenticationError();

        const rememberMe = this.findRememberMe(req);

        const output = await this.refreshUseCase.execute({ refreshToken });

        this.setAuthCookies(res, output.accessToken, output.refreshToken, rememberMe);

        const response: ApiSuccess = {
            success: true,
        };
        res.status(200).json(response);
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
