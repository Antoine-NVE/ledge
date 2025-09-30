import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/User';
import { removePassword } from '../utils/sanitize';
import { AuthCookieService } from '../services/AuthCookieService';
import { generateToken } from '../utils/token';
import RefreshTokenModel from '../models/RefreshToken';
import { JwtService } from '../services/JwtService';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';
import { RefreshTokenService } from '../services/RefreshTokenService';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { exit } from 'process';
import { RequiredRefreshTokenError } from '../errors/UnauthorizedError';
import { loginSchema, registerSchema } from '../schemas/userSchema';

export class AuthController {
    constructor(private authService: AuthService) {}

    async register(req: Request, res: Response) {
        const body = await registerSchema.validate(req.body, { abortEarly: false });

        // The user can't choose to be remembered at registration
        // Next time the user logs in, they can choose to be remembered
        const rememberMe = false;

        const { user, accessToken, refreshToken } = await this.authService.register(
            body.email,
            body.password,
        );

        const authCookieService = new AuthCookieService(req, res);
        authCookieService.setAllAuthCookies(accessToken, refreshToken.token, rememberMe);

        res.status(201).json({
            message: 'User registered successfully',
            data: {
                user,
            },
            errors: null,
        });
    }

    async login(req: Request, res: Response) {
        const body = await loginSchema.validate(req.body, { abortEarly: false });

        const { user, accessToken, refreshToken } = await this.authService.login(
            body.email,
            body.password,
        );

        const authCookieService = new AuthCookieService(req, res);
        authCookieService.setAllAuthCookies(accessToken, refreshToken.token, body.rememberMe);

        res.status(200).json({
            message: 'User logged in successfully',
            data: {
                user,
            },
            errors: null,
        });
    }

    async refresh(req: Request, res: Response) {
        const authCookieService = new AuthCookieService(req, res);
        const token = authCookieService.getRefreshTokenCookie();
        if (!token) throw new RequiredRefreshTokenError();

        let rememberMe = authCookieService.getRememberMeCookie();
        if (rememberMe === undefined) rememberMe = false; // Default to false if not provided

        const { accessToken, refreshToken } = await this.authService.refresh(token);

        authCookieService.setAllAuthCookies(accessToken, refreshToken.token, rememberMe);

        res.status(200).json({
            message: 'Token refreshed successfully',
            data: null,
            errors: null,
        });
    }

    async logout(req: Request, res: Response) {
        const authCookieService = new AuthCookieService(req, res);
        const token = authCookieService.getRefreshTokenCookie();

        await this.authService.logout(token);

        authCookieService.clearAllAuthCookies();

        res.status(200).json({
            message: 'User logged out successfully',
            data: null,
            errors: null,
        });
    }
}
