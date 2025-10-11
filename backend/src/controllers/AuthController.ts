import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { CookieService } from '../services/CookieService';
import { JwtService } from '../services/JwtService';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { exit } from 'process';
import { RequiredRefreshTokenError } from '../errors/UnauthorizedError';
import { loginInputSchema, registerInputSchema } from '../schemas/authSchema';

export class AuthController {
    constructor(private authService: AuthService) {}

    register = async (req: Request, res: Response) => {
        const { email, password } = registerInputSchema.parse(req.body);

        // The user can't choose to be remembered at registration
        // Next time the user logs in, they can choose to be remembered
        const rememberMe = false;

        const { user, accessToken, refreshToken } = await this.authService.register(
            email,
            password,
        );

        const cookieService = new CookieService(req, res);
        cookieService.setAuth(accessToken, refreshToken.token, rememberMe);

        res.status(201).json({
            message: 'User registered successfully',
            data: {
                user,
            },
            errors: null,
        });
    };

    login = async (req: Request, res: Response) => {
        const { email, password, rememberMe } = loginInputSchema.parse(req.body);

        const { user, accessToken, refreshToken } = await this.authService.login(email, password);

        const cookieService = new CookieService(req, res);
        cookieService.setAuth(accessToken, refreshToken.token, rememberMe);

        res.status(200).json({
            message: 'User logged in successfully',
            data: {
                user,
            },
            errors: null,
        });
    };

    refresh = async (req: Request, res: Response) => {
        const cookieService = new CookieService(req, res);
        const token = cookieService.getRefreshToken();
        if (!token) throw new RequiredRefreshTokenError();

        let rememberMe = cookieService.getRememberMe();
        if (rememberMe === undefined) rememberMe = false; // Default to false if not provided

        const { accessToken, refreshToken } = await this.authService.refresh(token);

        cookieService.setAuth(accessToken, refreshToken.token, rememberMe);

        res.status(200).json({
            message: 'Tokens refreshed successfully',
            data: null,
            errors: null,
        });
    };

    logout = async (req: Request, res: Response) => {
        const cookieService = new CookieService(req, res);
        const token = cookieService.getRefreshToken();

        if (token) await this.authService.logout(token);

        cookieService.clearAuth();

        res.status(200).json({
            message: 'User logged out successfully',
            data: null,
            errors: null,
        });
    };
}
