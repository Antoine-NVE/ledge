import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/User';
import { removePassword } from '../utils/sanitize';
import AuthCookieService from '../services/AuthCookieService';
import { generateToken } from '../utils/token';
import RefreshTokenModel from '../models/RefreshToken';
import JwtService from '../services/JwtService';
import AuthService from '../services/AuthService';
import UserRepository from '../repositories/UserRepository';
import RefreshTokenService from '../services/RefreshTokenService';
import RefreshTokenRepository from '../repositories/RefreshTokenRepository';
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

export const register = async (req: Request<object, object, RegisterBody>, res: Response) => {
    const { email, password } = req.body;

    // The user can't choose to be remembered at registration
    // Next time the user logs in, they can choose to be remembered
    const rememberMe = false;

    const authService = new AuthService(
        new UserRepository(UserModel),
        new JwtService(process.env.JWT_SECRET!),
        new RefreshTokenService(new RefreshTokenRepository(RefreshTokenModel)),
    );
    const { user, accessToken, refreshToken } = await authService.register(email, password);

    const authCookieService = new AuthCookieService(req, res);
    authCookieService.setAllAuthCookies(accessToken, refreshToken.token, rememberMe);

    res.status(201).json({
        message: 'User registered successfully',
        data: {
            user,
        },
        errors: null,
    });
};

export const login = async (req: Request<object, object, LoginBody>, res: Response) => {
    const { email, password, rememberMe } = req.body;

    const authService = new AuthService(
        new UserRepository(UserModel),
        new JwtService(process.env.JWT_SECRET!),
        new RefreshTokenService(new RefreshTokenRepository(RefreshTokenModel)),
    );
    const { user, accessToken, refreshToken } = await authService.login(email, password);

    const authCookieService = new AuthCookieService(req, res);
    authCookieService.setAllAuthCookies(accessToken, refreshToken.token, rememberMe);

    res.status(200).json({
        message: 'User logged in successfully',
        data: {
            user,
        },
        errors: null,
    });
};

export const refresh = async (req: Request, res: Response) => {
    const authCookieService = new AuthCookieService(req, res);
    const token = authCookieService.getRefreshTokenCookie();

    let rememberMe = authCookieService.getRememberMeCookie();
    if (rememberMe === undefined) rememberMe = false; // Default to false if not provided

    const authService = new AuthService(
        new UserRepository(UserModel),
        new JwtService(process.env.JWT_SECRET!),
        new RefreshTokenService(new RefreshTokenRepository(RefreshTokenModel)),
    );
    const { accessToken, refreshTokenPopulated } = await authService.refresh(token);

    authCookieService.setAllAuthCookies(accessToken, refreshTokenPopulated.token, rememberMe);

    res.status(200).json({
        message: 'Token refreshed successfully',
        data: {
            user: refreshTokenPopulated.user,
        },
        errors: null,
    });
};

export const logout = async (req: Request, res: Response) => {
    const authCookieService = new AuthCookieService(req, res);
    const token = authCookieService.getRefreshTokenCookie();

    const authService = new AuthService(
        new UserRepository(UserModel),
        new JwtService(process.env.JWT_SECRET!),
        new RefreshTokenService(new RefreshTokenRepository(RefreshTokenModel)),
    );
    authService.logout(token);

    authCookieService.clearAllAuthCookies();

    res.status(200).json({
        message: 'User logged out successfully',
        data: null,
        errors: null,
    });
};
