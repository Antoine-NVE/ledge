import { Request, Response } from 'express';
import { AuthOrchestrator } from '../../application/auth/auth-orchestrator';
import { UnauthorizedError } from '../../infrastructure/errors/unauthorized-error';
import { CookieService } from '../../infrastructure/services/cookie-service';
import { removePasswordHash } from '../../infrastructure/utils/clean-utils';

export class AuthController {
    constructor(private authOrchestrator: AuthOrchestrator) {}

    register = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        // The user can't choose to be remembered at registration
        // Next time the user logs in, they can choose to be remembered
        const rememberMe = false;

        const { user, accessToken, refreshToken } =
            await this.authOrchestrator.register(email, password);

        const cookieService = new CookieService(req, res);
        cookieService.setAuth(accessToken, refreshToken.token, rememberMe);

        res.status(201).json({
            message: 'User registered successfully',
            data: {
                user: removePasswordHash(user),
            },
        });
    };

    login = async (req: Request, res: Response) => {
        const { email, password, rememberMe } = req.body;

        const { user, accessToken, refreshToken } =
            await this.authOrchestrator.login(email, password);

        const cookieService = new CookieService(req, res);
        cookieService.setAuth(accessToken, refreshToken.token, rememberMe);

        res.status(200).json({
            message: 'User logged in successfully',
            data: {
                user: removePasswordHash(user),
            },
        });
    };

    refresh = async (req: Request, res: Response) => {
        const cookieService = new CookieService(req, res);
        const token = cookieService.getRefreshToken();
        if (!token) throw new UnauthorizedError('Required refresh token');

        let rememberMe = cookieService.getRememberMe();
        if (rememberMe === undefined) rememberMe = false; // Default to false if not provided

        const { accessToken, refreshToken } =
            await this.authOrchestrator.refresh(token);

        cookieService.setAuth(accessToken, refreshToken.token, rememberMe);

        res.status(200).json({
            message: 'Tokens refreshed successfully',
        });
    };

    logout = async (req: Request, res: Response) => {
        const cookieService = new CookieService(req, res);
        const token = cookieService.getRefreshToken();

        if (token) await this.authOrchestrator.logout(token);

        cookieService.clearAuth();

        res.status(200).json({
            message: 'User logged out successfully',
        });
    };
}
