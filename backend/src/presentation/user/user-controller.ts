import { Request, Response } from 'express';
import { UserOrchestrator } from '../../application/user/user-orchestrator';
import { removePasswordHash } from '../../infrastructure/utils/clean';
import { SendVerificationEmailBody, VerifyEmailBody } from './user-types';
import { ParamsDictionary } from 'express-serve-static-core';
import { Logger } from '../../application/ports/logger';

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

        await this.userOrchestrator.sendVerificationEmail(
            req.user,
            frontendBaseUrl,
        );

        const message = 'Verification email sent successfully';
        this.logger.info(message, { userId: req.user._id });
        res.status(200).json({
            message,
        });
    };

    verifyEmail = async (
        req: Request<ParamsDictionary, unknown, VerifyEmailBody>,
        res: Response,
    ): Promise<void> => {
        const { jwt } = req.body;

        const user = await this.userOrchestrator.verifyEmail(jwt);

        const message = 'Email verified successfully';
        this.logger.info(message, { userId: user._id });
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
