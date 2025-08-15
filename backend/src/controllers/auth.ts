import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import bcrypt from 'bcrypt';
import UserModel from '../models/User';
import { removePassword } from '../utils/sanitize';
import { formatMongooseValidationErrors } from '../utils/error';
import {
    clearAccessToken,
    clearRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
} from '../services/authCookie';
import { createJwt } from '../utils/jwt';
import { generateToken } from '../utils/token';
import RefreshTokenModel from '../models/RefreshToken';

interface AuthBody {
    email: string;
    password: string;
}

export const register = async (req: Request<object, object, AuthBody>, res: Response) => {
    const { email, password } = req.body;

    try {
        let user = new UserModel({
            email,
            password,
        });
        user = await user.save();

        // Automatically connect the user after registration
        const accessToken = createJwt(user._id.toString());
        setAccessTokenCookie(res, accessToken);

        // Generate and save the refresh token
        const refreshToken = new RefreshTokenModel({
            token: generateToken(),
            user,
        });
        await refreshToken.save();
        setRefreshTokenCookie(res, refreshToken.token);

        res.status(201).json({
            message: 'User registered successfully',
            data: {
                user: removePassword(user),
            },
            errors: null,
        });
    } catch (error: unknown) {
        if (error instanceof MongooseError.ValidationError) {
            res.status(400).json({
                message: 'Validation error',
                data: null,
                errors: formatMongooseValidationErrors(error),
            });
        } else {
            res.status(500).json({
                message: 'Internal server error',
                data: null,
                errors: null,
            });
        }
    }
};

export const login = async (req: Request<object, object, AuthBody>, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email }).select('+password');

        if (!user) {
            res.status(401).json({
                message: 'Invalid email or password',
                data: null,
                errors: null,
            });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({
                message: 'Invalid email or password',
                data: null,
                errors: null,
            });
            return;
        }

        // Automatically connect the user after login
        const accessToken = createJwt(user._id.toString());
        setAccessTokenCookie(res, accessToken);

        // Generate and save the refresh token
        const refreshToken = new RefreshTokenModel({
            token: generateToken(),
            user,
        });
        await refreshToken.save();
        setRefreshTokenCookie(res, refreshToken.token);

        res.status(200).json({
            message: 'User logged in successfully',
            data: {
                user: removePassword(user),
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

export const refresh = async (req: Request, res: Response) => {
    const token = req.cookies.refresh_token;
    if (!token) {
        res.status(401).json({
            message: 'Refresh token is required',
            data: null,
            errors: null,
        });
        return;
    }

    try {
        const refreshToken = await RefreshTokenModel.findOne({ token }).populate('user');
        if (!refreshToken || !refreshToken.user) {
            clearRefreshToken(res);

            res.status(401).json({
                message: 'Invalid refresh token',
                data: null,
                errors: null,
            });
            return;
        }

        // Check if the refresh token is expired
        if (refreshToken.expiresAt < new Date()) {
            clearRefreshToken(res);

            res.status(401).json({
                message: 'Refresh token has expired',
                data: null,
                errors: null,
            });
            return;
        }

        const accessToken = createJwt(refreshToken.user._id.toString());
        setAccessTokenCookie(res, accessToken);

        refreshToken.token = generateToken();
        refreshToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await refreshToken.save();
        setRefreshTokenCookie(res, refreshToken.token);

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
    const token = req.cookies.refresh_token;

    try {
        if (token) {
            await RefreshTokenModel.deleteOne({ token });
        }

        clearAccessToken(res);
        clearRefreshToken(res);

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
