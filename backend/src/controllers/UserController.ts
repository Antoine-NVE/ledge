import { Request, Response } from 'express';
import { JwtService } from '../services/JwtService';
import { EmailService } from '../services/EmailService';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { InvalidDataError, UndefinedUserError } from '../errors/InternalServerError';
import { env } from '../config/env';
import { UserSchema } from '../schemas/UserSchema';
import { SecuritySchema } from '../schemas/SecuritySchema';
import { FormatUtils } from '../utils/FormatUtils';

export class UserController {
    constructor(
        private userService: UserService,
        private securitySchema: SecuritySchema,
    ) {}

    sendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        const result = this.securitySchema.sendVerificationEmail.safeParse(req.body);
        if (!result.success) throw new InvalidDataError(result.error);
        const { frontendBaseUrl } = result.data;

        await this.userService.sendVerificationEmail(user, frontendBaseUrl);

        res.status(200).json({
            message: 'Verification email sent successfully',
            data: null,
            errors: null,
        });
    };

    verifyEmail = async (req: Request<{ token: string }>, res: Response): Promise<void> => {
        const result = this.securitySchema.verifyEmail.safeParse(req.body);
        if (!result.success) throw new InvalidDataError(result.error);
        const { token } = result.data;

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
