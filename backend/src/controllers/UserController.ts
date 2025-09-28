import { Request, Response } from 'express';
import UserModel from '../models/User';
import { JwtService } from '../services/JwtService';
import { EmailService } from '../services/EmailService';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { UndefinedUserError } from '../errors/InternalServerError';
import { env } from '../config/env';

export class UserController {
    constructor(private userService: UserService) {}

    async me(req: Request, res: Response): Promise<void> {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        res.status(200).json({
            message: 'User retrieved successfully',
            data: {
                user,
            },
            errors: null,
        });
    }

    async sendEmailVerificationEmail(
        req: Request<object, object, { frontendBaseUrl: string }>,
        res: Response,
    ): Promise<void> {
        const user = req.user;
        if (!user) throw new UndefinedUserError();
        const { frontendBaseUrl } = req.body;

        await this.userService.sendEmailVerificationEmail(env.EMAIL_FROM!, user, frontendBaseUrl);

        res.status(200).json({
            message: 'Verification email sent successfully',
            data: null,
            errors: null,
        });
    }

    async verifyEmail(req: Request<{ token: string }>, res: Response): Promise<void> {
        const { token } = req.params;

        await this.userService.verifyEmail(token);

        res.status(200).json({
            message: 'Email verified successfully',
            data: null,
            errors: null,
        });
    }
}
