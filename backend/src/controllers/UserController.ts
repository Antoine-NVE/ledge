import { Request, Response } from 'express';
import { JwtService } from '../services/JwtService';
import { EmailService } from '../services/EmailService';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { InvalidDataError, UndefinedUserError } from '../errors/InternalServerError';
import { env } from '../config/env';
import z from 'zod';
import { clearUser } from '../utils/clear';
import { parseSchema } from '../utils/schema';
import { allowedOriginSchema, jwtSchema } from '../schemas/security';

export class UserController {
    constructor(private userService: UserService) {}

    sendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        const frontendBaseUrl = parseSchema(allowedOriginSchema, req.body.frontendBaseUrl);

        await this.userService.sendVerificationEmail(user, frontendBaseUrl);

        res.status(200).json({
            message: 'Verification email sent successfully',
        });
    };

    verifyEmail = async (req: Request, res: Response): Promise<void> => {
        const jwt = parseSchema(jwtSchema, req.body.jwt);

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
                user: clearUser(user),
            },
        });
    };
}
