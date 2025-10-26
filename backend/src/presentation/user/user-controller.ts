import { Request, Response } from 'express';
import { InternalServerError } from '../../infrastructure/errors/internal-server-error';
import { UserOrchestrator } from '../../application/user/user-orchestrator';
import {
    sendVerificationEmailBodySchema,
    verifyEmailBodySchema,
} from './user-schemas';
import { parseSchema } from '../../infrastructure/utils/schema-utils';
import { removePasswordHash } from '../../infrastructure/utils/clean-utils';

export class UserController {
    constructor(private userOrchestrator: UserOrchestrator) {}

    sendVerificationEmail = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const user = req.user;
        if (!user) throw new InternalServerError('Undefined user');

        const { frontendBaseUrl } = parseSchema(
            sendVerificationEmailBodySchema,
            req.body,
        );

        await this.userOrchestrator.sendVerificationEmail(
            user,
            frontendBaseUrl,
        );

        res.status(200).json({
            message: 'Verification email sent successfully',
        });
    };

    verifyEmail = async (req: Request, res: Response): Promise<void> => {
        const { jwt } = parseSchema(verifyEmailBodySchema, req.body);

        await this.userOrchestrator.verifyEmail(jwt);

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
                user: removePasswordHash(user),
            },
        });
    };
}
