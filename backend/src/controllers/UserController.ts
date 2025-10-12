import { Request, Response } from 'express';
import { JwtService } from '../services/JwtService';
import { EmailService } from '../services/EmailService';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { UndefinedUserError } from '../errors/InternalServerError';
import { env } from '../config/env';
import { UserSchema } from '../schemas/UserSchema';

export class UserController {
    constructor(
        private userService: UserService,
        private userSchema: UserSchema,
    ) {}

    sendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        const { frontendBaseUrl } = this.userSchema.sendVerificationEmail.parse(req.body);

        await this.userService.sendVerificationEmail(user, frontendBaseUrl);

        res.status(200).json({
            message: 'Verification email sent successfully',
            data: null,
            errors: null,
        });
    };

    verifyEmail = async (req: Request<{ token: string }>, res: Response): Promise<void> => {
        const { token } = this.userSchema.verifyEmail.parse(req.body);

        await this.userService.verifyEmail(token);

        res.status(200).json({
            message: 'Email verified successfully',
            data: null,
            errors: null,
        });
    };

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
}
