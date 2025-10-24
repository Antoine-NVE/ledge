import { Request, Response } from 'express';
import { UserService } from '../services/user-service';
import { parseSchema } from '../utils/schema-utils';
import { allowedOriginSchema, jwtSchema } from '../schemas/security-schemas';
import { InternalServerError } from '../errors/internal-server-error';

export class UserController {
    constructor(private userService: UserService) {}

    sendVerificationEmail = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const user = req.user;
        if (!user) throw new InternalServerError('Undefined user');

        const frontendBaseUrl = parseSchema(
            allowedOriginSchema,
            req.body.frontendBaseUrl,
        );

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
        if (!user) throw new InternalServerError('Undefined user');

        res.status(200).json({
            message: 'User retrieved successfully',
            data: {
                user: this.userService.removePasswordHash(user),
            },
        });
    };
}
