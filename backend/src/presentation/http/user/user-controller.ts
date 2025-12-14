import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { UserOrchestrator } from '../../../application/user/user-orchestrator';
import { Logger } from '../../../application/ports/logger';
import { removePasswordHash } from '../../../core/utils/clean';
import z from 'zod/index';
import {
    createSendVerificationEmailBodySchema,
    verifyEmailBodySchema,
} from './user-schemas';

type SendVerificationEmailBody = z.infer<
    ReturnType<typeof createSendVerificationEmailBodySchema>
>;

type VerifyEmailBody = z.infer<typeof verifyEmailBodySchema>;

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
            success: true,
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
            success: true,
            message,
        });
    };

    me = (req: Request, res: Response): void => {
        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: {
                user: removePasswordHash(req.user),
            },
        });
    };
}
