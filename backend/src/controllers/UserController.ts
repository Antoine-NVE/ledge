import { Request, Response } from 'express';
import { JwtService } from '../services/JwtService';
import { EmailService } from '../services/EmailService';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { UndefinedUserError } from '../errors/InternalServerError';
import { env } from '../config/env';
import { userVerifyEmailInputSchema } from '../schemas/userSchema';

export class UserController {
    constructor(private userService: UserService) {}

    me = async (req: Request, res: Response): Promise<void> => {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        res.status(200).json({
            message: 'User retrieved successfully',
            data: {
                user,
            },
            errors: null,
        });
    };

    sendEmailVerificationEmail = async (req: Request, res: Response): Promise<void> => {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        const { frontendBaseUrl } = req.body;

        await this.userService.sendEmailVerificationEmail(user, frontendBaseUrl);

        res.status(200).json({
            message: 'Verification email sent successfully',
            data: null,
            errors: null,
        });
    };

    verifyEmail = async (req: Request<{ token: string }>, res: Response): Promise<void> => {
        const { token } = userVerifyEmailInputSchema.parse(req.body);

        await this.userService.verifyEmail(token);

        res.status(200).json({
            message: 'Email verified successfully',
            data: null,
            errors: null,
        });
    };
}
