import { Request, Response } from 'express';
import { SendVerificationEmailBody, VerifyEmailBody } from './user-types';
import { ParamsDictionary } from 'express-serve-static-core';
import { UserOrchestrator } from '../../../application/user/user-orchestrator';
import { Logger } from '../../../application/ports/logger';
import { removePasswordHash } from '../../../core/utils/clean';

export class UserController {
    constructor(
        private userOrchestrator: UserOrchestrator,
        private logger: Logger,
    ) {}

    sendVerificationEmail = async (
        req: Request<ParamsDictionary, unknown, SendVerificationEmailBody>,
        res: Response,
    ): Promise<void> => {
        const { frontendBaseUrl } = req.body;

        await this.userOrchestrator.sendVerificationEmail({
            user: req.user,
            frontendBaseUrl,
        });

        const message = 'Verification email sent successfully';
        this.logger.info(message, { userId: req.user.id });
        res.status(200).json({
            message,
        });
    };

    verifyEmail = async (
        req: Request<ParamsDictionary, unknown, VerifyEmailBody>,
        res: Response,
    ): Promise<void> => {
        const { token } = req.body;

        const { user } = await this.userOrchestrator.verifyEmail({ token });

        const message = 'Email verified successfully';
        this.logger.info(message, { userId: user.id });
        res.status(200).json({
            message,
        });
    };

    me = (req: Request, res: Response): void => {
        res.status(200).json({
            message: 'User retrieved successfully',
            data: {
                user: removePasswordHash(req.user),
            },
        });
    };
}
