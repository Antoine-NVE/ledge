import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import bcrypt from 'bcrypt';

import UserModel from '../models/User';
import { connect } from '../services/auth';

interface AuthBody {
    email: string;
    password: string;
}

export const register = async (req: Request<{}, {}, AuthBody>, res: Response) => {
    try {
        const { email, password } = req.body;

        let user = new UserModel({
            email,
            password,
        });
        user = await user.save();

        // Automatically connect the user after registration
        connect(res, user);

        // Remove password from the response
        const userObj = user.toObject() as any;
        delete userObj.password;

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

export const login = async (req: Request<{}, {}, AuthBody>, res: Response) => {
    try {
        const { email, password } = req.body;

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
        connect(res, user);

        // Remove password from the response
        const userObj = user.toObject() as any;
        delete userObj.password;

        res.status(200).json({
            message: 'User logged in successfully',
            data: {
                user: userObj,
            },
            errors: null,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            data: null,
            errors: null,
        });
    }
};
