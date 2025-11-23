import { Request, Response } from 'express';
import { AuthOrchestrator } from '../../application/auth/auth-orchestrator';
import { UnauthorizedError } from '../../infrastructure/errors/unauthorized-error';
import { CookieService } from '../../infrastructure/services/cookie-service';
import { removePasswordHash } from '../../infrastructure/utils/clean-utils';
import { LoginBody, RegisterBody } from './auth-types';
import { ParamsDictionary } from 'express-serve-static-core';
import { Logger } from 'pino';
import { RefreshToken } from '../../domain/refresh-token/refresh-token-types';
import { NotFoundError } from '../../infrastructure/errors/not-found-error';

export class AuthController {
    constructor(
        private authOrchestrator: AuthOrchestrator,
        private logger: Logger,
    ) {}

    register = async (
        req: Request<ParamsDictionary, unknown, RegisterBody>,
        res: Response,
    ) => {
        const { email, password } = req.body;

        // The user can't choose to be remembered at registration
        // Next time the user logs in, they can choose to be remembered
        const rememberMe = false;

        const { user, accessToken, refreshToken } =
            await this.authOrchestrator.register({ email, password });

        const cookieService = new CookieService(req, res);
        cookieService.setAuth(accessToken, refreshToken.token, rememberMe);

        const message = 'User registered successfully';
        this.logger.info(
            { userId: user._id, refreshTokenId: refreshToken._id },
            message,
        );
        res.status(201).json({
            message,
            data: {
                user: removePasswordHash(user),
            },
        });
    };

    login = async (
        req: Request<ParamsDictionary, unknown, LoginBody>,
        res: Response,
    ) => {
        const { email, password, rememberMe } = req.body;

        const { user, accessToken, refreshToken } =
            await this.authOrchestrator.login({ email, password });

        const cookieService = new CookieService(req, res);
        cookieService.setAuth(accessToken, refreshToken.token, rememberMe);

        const message = 'User logged in successfully';
        this.logger.info(
            { userId: user._id, refreshTokenId: refreshToken._id },
            message,
        );
        res.status(200).json({
            message,
            data: {
                user: removePasswordHash(user),
            },
        });
    };

    refresh = async (req: Request, res: Response) => {
        const cookieService = new CookieService(req, res);
        const token = cookieService.getRefreshToken();
        if (!token) throw new UnauthorizedError('Required refresh token');

        const rememberMe = cookieService.getRememberMe();

        const { accessToken, refreshToken } =
            await this.authOrchestrator.refresh(token);

        cookieService.setAuth(accessToken, refreshToken.token, rememberMe);

        const message = 'Tokens refreshed successfully';
        this.logger.info(
            { userId: refreshToken.userId, refreshTokenId: refreshToken._id },
            message,
        );
        res.status(200).json({
            message,
        });
    };

    logout = async (req: Request, res: Response) => {
        const cookieService = new CookieService(req, res);
        const token = cookieService.getRefreshToken();

        let deleted: RefreshToken | null = null;
        if (token) {
            deleted = await this.authOrchestrator.logout(token).catch((err) => {
                if (err instanceof NotFoundError) return null;
                throw err;
            });
        }

        cookieService.clearAuth();

        const message = 'User logged out successfully';
        if (deleted) {
            this.logger.info(
                { userId: deleted.userId, refreshTokenId: deleted._id },
                message,
            );
        }
        res.status(200).json({
            message,
        });
    };
}
