import { Request, Response } from 'express';
import { CookieService } from '../../services/cookie-service';
import { AuthOrchestrator } from '../../application/auth/auth-orchestrator';
import { parseSchema } from '../../utils/schema-utils';
import {
    userLoginSchema,
    userRegisterSchema,
} from '../../schemas/user-schemas';
import { UnauthorizedError } from '../../errors/unauthorized-error';
import { removePasswordHash } from '../../utils/clean-utils';

export class AuthController {
    constructor(private authOrchestrator: AuthOrchestrator) {}

    register = async (req: Request, res: Response) => {
        const { email, password } = parseSchema(
            userRegisterSchema,
            req.body,
            true,
        );

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
        const { email, password, rememberMe } = parseSchema(
            userLoginSchema,
            req.body,
            true,
        );

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
