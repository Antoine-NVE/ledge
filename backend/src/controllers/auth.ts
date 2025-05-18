import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import bcrypt from 'bcrypt';

import UserModel, { UserDocument } from '../models/User';
import { createAccessToken, removeAccessToken } from '../services/auth';
import { sanitizeUser } from '../utils/sanitize';

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
        createAccessToken(res, user);

        // Remove password from the response
        const userObj = sanitizeUser(user);

        res.status(201).json({
            message: 'User registered successfully',
            data: {
                user: userObj,
            },
            errors: null,
        });
    } catch (error: unknown) {
        if (error instanceof MongooseError.ValidationError) {
            // Handle validation errors
            const errors: Record<string, string> = {};
            for (const [key, err] of Object.entries(error.errors)) {
                errors[key] = err.message;
            }

            res.status(400).json({
                message: 'Validation error',
                data: null,
                errors,
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
        createAccessToken(res, user);

        // Remove password from the response
        const userObj = sanitizeUser(user);

        res.status(200).json({
            message: 'User logged in successfully',
            data: {
                user: userObj,
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

export const logout = (req: Request, res: Response) => {
    removeAccessToken(res);

    res.status(200).json({
        message: 'User logged out successfully',
        data: null,
        errors: null,
    });
};
