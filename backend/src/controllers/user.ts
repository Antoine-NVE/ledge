import { Request, Response } from 'express';
import UserModel from '../models/User';
import { sendEmail } from '../services/email';
import { createEmailVerificationJwt, verifyEmailVerificationJwt } from '../services/jwt';

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

        if (user.isEmailVerified) {
            res.status(400).json({
                message: 'Email already verified',
                data: null,
                errors: null,
            });
            return;
        }

        if (user.emailVerificationRequestExpiresAt && user.emailVerificationRequestExpiresAt > new Date()) {
            res.status(400).json({
                message: 'Email verification already sent, please wait before requesting again',
                data: null,
                errors: null,
            });
            return;
        }

        const frontendUrl = process.env.FRONTEND_URL;

        const jwt = createEmailVerificationJwt(user._id.toString(), process.env.JWT_SECRET!);

        const [info, error] = await sendEmail(
            user.email,
            'Please verify your email address',
            `Click here to verify your email address: <a href="${frontendUrl}/verify-email/${jwt}">verify email</a>. This link will expire in 15 minutes.`,
        );

        console.log(info);

        if (error) {
            console.error(error);

            res.status(500).json({
                message: 'Failed to send verification email',
                data: null,
                errors: error.message,
            });
            return;
        }

        user.emailVerificationRequestExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        await user.save();

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

export const verifyEmail = async (req: Request<{ token: string }>, res: Response) => {
    const { token } = req.params;

    const decoded = verifyEmailVerificationJwt(token, process.env.JWT_SECRET!);
    if (decoded) {
        const user = await UserModel.findById(decoded.sub);
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
