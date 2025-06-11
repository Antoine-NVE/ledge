import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { createJwt, verifyJwt } from '../utils/jwt';
import UserModel from '../models/User';

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        res.status(200).json({
            message: 'User retrieved successfully',
            data: {
                user,
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

export const sendVerificationEmail = async (req: Request, res: Response) => {
    try {
        const user = req.user!;

        const frontendUrl = process.env.FRONTEND_URL;

        const jwt = createJwt({
            _id: user._id,
        });

        const transporter = nodemailer.createTransport({
            host: 'smtp',
            port: 1025,
            secure: false,
        });

        const mailOptions = {
            from: '"Ledge" <no-reply@ledge.com>',
            to: user.email,
            subject: 'Please verify your email address',
            html:
                'Click here to verify your email address: <a href="' +
                frontendUrl +
                '/verify-email/' +
                jwt +
                '">verify email</a>',
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);

                res.status(500).json({
                    message: 'Failed to send verification email',
                    data: null,
                    errors: error.message,
                });
                return;
            }
        });

        res.status(200).json({
            message: 'Verification email sent successfully',
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

export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.params;

    const decoded = verifyJwt(token);

    if (decoded !== null && typeof decoded === 'object' && '_id' in decoded) {
        const user = await UserModel.findById(decoded._id);
        if (!user) {
            res.status(404).json({
                message: 'User not found',
                data: null,
                errors: null,
            });
            return;
        }

        if (user.isEmailVerified) {
            res.status(400).json({
                message: 'Email already verified',
                data: null,
                errors: null,
            });
            return;
        }

        user.isEmailVerified = true;
        await user.save();

        res.status(200).json({
            message: 'Email verified successfully',
            data: null,
            errors: null,
        });

        return;
    }

    res.status(400).json({
        message: 'Invalid token',
        data: null,
        errors: null,
    });
};
