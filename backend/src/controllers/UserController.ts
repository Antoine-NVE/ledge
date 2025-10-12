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
import z from 'zod';

export class UserController {
    constructor(
        private userService: UserService,
        private securitySchema: SecuritySchema,
    ) {}

    sendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        const frontendBaseUrl = this.securitySchema.parseAllowedOrigin(req.body);

        await this.userService.sendVerificationEmail(user, frontendBaseUrl);

        res.status(200).json({
            message: 'Verification email sent successfully',
        });
    };

    verifyEmail = async (req: Request, res: Response): Promise<void> => {
        const jwt = this.securitySchema.parseJwt(req.body);

        await this.userService.verifyEmail(jwt);

        res.status(200).json({
            message: 'Email verified successfully',
        });
    };

    me = async (req: Request, res: Response): Promise<void> => {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        res.status(200).json({
            message: 'User retrieved successfully',
            data: {
                user: FormatUtils.formatSafeUser(user),
            },
        });
    };
}
