import { Request, Response } from 'express';
import UserModel from '../models/User';
import { createEmailVerificationJwt, verifyEmailVerificationJwt } from '../services/JwtService';
import { createTransporter, sendEmailVerificationEmail } from '../services/email';

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
    const { frontendBaseUrl } = req.body || {};
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    if (!frontendBaseUrl || !allowedOrigins.includes(frontendBaseUrl)) {
        res.status(400).json({
            message: 'Invalid frontend URL',
            data: null,
            errors: null,
        });
        return;
    }

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

        if (user.emailVerificationCooldownExpiresAt && user.emailVerificationCooldownExpiresAt > new Date()) {
            res.status(400).json({
                message: 'Email verification already sent, please wait before requesting again',
                data: null,
                errors: null,
            });
            return;
        }

        const from = process.env.EMAIL_FROM!;
        const to = user.email;
        const transporter = createTransporter(
            process.env.SMTP_HOST!,
            Number(process.env.SMTP_PORT),
            process.env.SMTP_SECURE === 'true',
            {
                user: process.env.SMTP_USER!,
                pass: process.env.SMTP_PASS!,
            },
        );
        const jwt = createEmailVerificationJwt(user._id.toString(), process.env.JWT_SECRET!);

        const info = await sendEmailVerificationEmail(from, to, transporter, frontendBaseUrl, jwt);

        if (!info) {
            res.status(500).json({
                message: 'Failed to send verification email',
                data: null,
                errors: null,
            });
            return;
        }

        user.emailVerificationCooldownExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
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
