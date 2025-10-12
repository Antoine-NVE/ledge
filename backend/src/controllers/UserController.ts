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

        const { success, data, error } = this.securitySchema.sendVerificationEmail.safeParse(
            req.body,
        );
        if (!success) throw new InvalidDataError(error);
        const { frontendBaseUrl } = data;

        await this.userService.sendVerificationEmail(user, frontendBaseUrl);

        res.status(200).json({
            message: 'Verification email sent successfully',
            data: null,
            errors: null,
        });
    };

    verifyEmail = async (req: Request<{ token: string }>, res: Response): Promise<void> => {
        const { success, data, error } = this.securitySchema.verifyEmail.safeParse(req.body);
        if (!success) throw new InvalidDataError(error);
        const { token } = data;

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

        const { passwordHash, ...safeUser } = user;

        res.status(200).json({
            message: 'User retrieved successfully',
            data: {
                user: safeUser,
            },
            errors: null,
        });
    };
}
