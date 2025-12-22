import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { AuthOrchestrator } from '../../../application/auth/auth-orchestrator';
import { Logger } from '../../../application/ports/logger';
import { CookieManager } from '../support/cookie-manager';
import { UnauthorizedError } from '../../../core/errors/unauthorized-error';
import { removePasswordHash } from '../../../core/utils/clean';
import z from 'zod';
import { loginBodySchema, registerBodySchema } from './auth-schemas';

type RegisterBody = z.infer<typeof registerBodySchema>;

type LoginBody = z.infer<typeof loginBodySchema>;

export class AuthController {
    constructor(
        private authOrchestrator: AuthOrchestrator,
        private logger: Logger,
        private cookieManager: CookieManager,
    ) {}

    register = async (req: Request<ParamsDictionary, unknown, RegisterBody>, res: Response) => {
        const { email, password } = req.body;

        // The user can't choose to be remembered at registration
        // Next time the user logs in, they can choose to be remembered
        const rememberMe = false;

        const result = await this.authOrchestrator.register({
            email,
            password,
        });
        if (!result.success) throw result.error;
        const { user, accessToken, refreshToken } = result.value;

        this.cookieManager.setAuth(res, accessToken, refreshToken.token, rememberMe);

        const message = 'User registered successfully';
        this.logger.info(message, {
            userId: user.id,
            refreshTokenId: refreshToken.id,
        });
        res.status(201).json({
            success: true,
            message,
            data: {
                user: removePasswordHash(user),
            },
        });
    };

    login = async (req: Request<ParamsDictionary, unknown, LoginBody>, res: Response) => {
        const { email, password, rememberMe } = req.body;

        const result = await this.authOrchestrator.login({ email, password });
        if (!result.success) throw result.error;
        const { user, accessToken, refreshToken } = result.value;

        this.cookieManager.setAuth(res, accessToken, refreshToken.token, rememberMe);

        const message = 'User logged in successfully';
        this.logger.info(message, {
            userId: user.id,
            refreshTokenId: refreshToken.id,
        });
        res.status(200).json({
            success: true,
            message,
            data: {
                user: removePasswordHash(user),
            },
        });
    };

    refresh = async (req: Request, res: Response) => {
        const token = this.cookieManager.getRefreshToken(req);
        if (!token) {
            throw new UnauthorizedError({ message: 'Required refresh token' });
        }

        let rememberMe = this.cookieManager.getRememberMe(req);
        if (rememberMe === undefined) rememberMe = false;

        const result = await this.authOrchestrator.refresh({ token });
        if (!result.success) throw result.error;
        const { accessToken, refreshToken } = result.value;

        this.cookieManager.setAuth(res, accessToken, refreshToken.token, rememberMe);

        const message = 'Tokens refreshed successfully';
        this.logger.info(message, {
            userId: refreshToken.userId,
            refreshTokenId: refreshToken.id,
        });
        res.status(200).json({
            success: true,
            message,
        });
    };

    logout = async (req: Request, res: Response) => {
        const token = this.cookieManager.getRefreshToken(req);
        if (!token) {
            throw new UnauthorizedError({ message: 'Required refresh token' });
        }

        const result = await this.authOrchestrator.logout({ token });
        if (!result.success) throw result.error;
        const { refreshToken } = result.value;

        this.cookieManager.clearAuth(res);

        const message = 'User logged out successfully';
        this.logger.info(message, {
            userId: refreshToken.userId,
            refreshTokenId: refreshToken.id,
        });
        res.status(200).json({
            success: true,
            message,
        });
    };
}
