import { Request, Response } from 'express';
import UserModel from '../models/User';
import { JwtService } from '../services/JwtService';
import { EmailService } from '../services/EmailService';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';

export const me = async (req: Request, res: Response) => {
    const user = req.user!;

    res.status(200).json({
        message: 'User retrieved successfully',
        data: {
            user,
        },
        errors: null,
    });
};

export const sendEmailVerificationEmail = async (
    req: Request<object, object, { frontendBaseUrl: string }>,
    res: Response,
) => {
    const { frontendBaseUrl } = req.body;
    const user = req.user!;

    const userService = new UserService(
        new JwtService(process.env.JWT_SECRET!),
        new EmailService({
            host: process.env.SMTP_HOST!,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER!,
                pass: process.env.SMTP_PASS!,
            },
        }),
        new UserRepository(UserModel),
    );

    await userService.sendEmailVerificationEmail(process.env.EMAIL_FROM!, user, frontendBaseUrl);

    res.status(200).json({
        message: 'Verification email sent successfully',
        data: null,
        errors: null,
    });
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
