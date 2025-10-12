import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { CookieService } from '../services/CookieService';
import { JwtService } from '../services/JwtService';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { exit } from 'process';
import { RequiredRefreshTokenError } from '../errors/UnauthorizedError';
import { UserSchema } from '../schemas/UserSchema';
import { ValidationError } from '../errors/BadRequestError';
import { FormatUtils } from '../utils/FormatUtils';

export class AuthController {
    constructor(
        private authService: AuthService,
        private userSchema: UserSchema,
    ) {}

    register = async (req: Request, res: Response) => {
        const { success, data, error } = this.userSchema.register.safeParse(req.body);
        if (!success) throw new ValidationError(error);
        const { email, password } = data;

        // The user can't choose to be remembered at registration
        // Next time the user logs in, they can choose to be remembered
        const rememberMe = false;

        const { user, accessToken, refreshToken } = await this.authService.register(
            email,
            password,
        );

        const cookieService = new CookieService(req, res);
        cookieService.setAuth(accessToken, refreshToken.token, rememberMe);

        const { passwordHash, ...safeUser } = user;

        res.status(201).json({
            message: 'User registered successfully',
            data: {
                user: safeUser,
            },
        });
    };

    login = async (req: Request, res: Response) => {
        const { success, data, error } = this.userSchema.login.safeParse(req.body);
        if (!success) throw new ValidationError(error);
        const { email, password, rememberMe } = data;

        const { user, accessToken, refreshToken } = await this.authService.login(email, password);

        const cookieService = new CookieService(req, res);
        cookieService.setAuth(accessToken, refreshToken.token, rememberMe);

        const { passwordHash, ...safeUser } = user;

        res.status(200).json({
            message: 'User logged in successfully',
            data: {
                user: safeUser,
            },
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
        });
    };

    logout = async (req: Request, res: Response) => {
        const cookieService = new CookieService(req, res);
        const token = cookieService.getRefreshToken();

        if (token) await this.authService.logout(token);

        cookieService.clearAuth();

        res.status(200).json({
            message: 'User logged out successfully',
        });
    };
}
