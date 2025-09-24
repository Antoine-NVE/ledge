import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/User';
import { removePassword } from '../utils/sanitize';
import AuthCookieService from '../services/AuthCookieService';
import { generateToken } from '../utils/token';
import RefreshTokenModel from '../models/RefreshToken';
import { createAccessJwt } from '../services/jwt';
import AuthService from '../services/AuthService';
import UserRepository from '../repositories/UserRepository';

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

    const authService = new AuthService(new UserRepository(UserModel));
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

    const authService = new AuthService(new UserRepository(UserModel));
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
    if (!token) {
        res.status(401).json({
            message: 'Refresh token is required',
            data: null,
            errors: null,
        });
        return;
    }

    let rememberMe = authCookieService.getRememberMeCookie();
    if (rememberMe === undefined) {
        rememberMe = false;
    }

    try {
        let refreshToken = await RefreshTokenModel.findOne({ token }).populate('user');
        if (!refreshToken || !refreshToken.user) {
            authCookieService.clearAllAuthCookies();

            res.status(401).json({
                message: 'Invalid refresh token',
                data: null,
                errors: null,
            });
            return;
        }

        // Check if the refresh token is expired
        if (refreshToken.expiresAt < new Date()) {
            authCookieService.clearAllAuthCookies();

            res.status(401).json({
                message: 'Refresh token has expired',
                data: null,
                errors: null,
            });
            return;
        }

        const accessToken = createAccessJwt(refreshToken.user._id.toString(), process.env.JWT_SECRET!);
        authCookieService.setAccessTokenCookie(accessToken, rememberMe);

        const user = refreshToken.user;
        await RefreshTokenModel.deleteOne({ token });
        refreshToken = await new RefreshTokenModel({
            token: generateToken(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            user,
        }).save();
        authCookieService.setRefreshTokenCookie(refreshToken.token, rememberMe);

        authCookieService.setRememberMeCookie(rememberMe);

        res.status(200).json({
            message: 'Tokens refreshed successfully',
            data: {
                user: refreshToken.user,
            },
            errors: null,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Internal server error',
            data: null,
            errors: null,
        });
    }
};

export const logout = async (req: Request, res: Response) => {
    const authCookieService = new AuthCookieService(req, res);
    const token = authCookieService.getRefreshTokenCookie();

    try {
        if (token) {
            await RefreshTokenModel.deleteOne({ token });
        }

        authCookieService.clearAllAuthCookies();

        res.status(200).json({
            message: 'User logged out successfully',
            data: null,
            errors: null,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Internal server error',
            data: null,
            errors: null,
        });
    }
};
