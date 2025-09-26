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

interface RegisterBody {
    email: string;
    password: string;
}

interface LoginBody {
    email: string;
    password: string;
    rememberMe: boolean;
}

export class AuthController {
    constructor(private authService: AuthService) {}

    async register(req: Request<object, object, RegisterBody>, res: Response) {
        const { email, password } = req.body;

        // The user can't choose to be remembered at registration
        // Next time the user logs in, they can choose to be remembered
        const rememberMe = false;

        const { user, accessToken, refreshToken } = await this.authService.register(email, password);

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

    async login(req: Request<object, object, LoginBody>, res: Response) {
        const { email, password, rememberMe } = req.body;

        const { user, accessToken, refreshToken } = await this.authService.login(email, password);

        const authCookieService = new AuthCookieService(req, res);
        authCookieService.setAllAuthCookies(accessToken, refreshToken.token, rememberMe);

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

        let rememberMe = authCookieService.getRememberMeCookie();
        if (rememberMe === undefined) rememberMe = false; // Default to false if not provided

        const { accessToken, refreshTokenPopulated } = await this.authService.refresh(token);

        authCookieService.setAllAuthCookies(accessToken, refreshTokenPopulated.token, rememberMe);

        res.status(200).json({
            message: 'Token refreshed successfully',
            data: {
                user: refreshTokenPopulated.user,
            },
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
