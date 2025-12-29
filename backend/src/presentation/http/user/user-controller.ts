import type { Request, Response } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import { UserOrchestrator } from '../../../application/user/user-orchestrator';
import type { Logger } from '../../../application/ports/logger.js';
import { removePasswordHash } from '../../../core/utils/clean.js';
import z from 'zod';
import { createSendVerificationEmailBodySchema, verifyEmailBodySchema } from './user-schemas.js';

type SendVerificationEmailBody = z.infer<ReturnType<typeof createSendVerificationEmailBodySchema>>;

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

        const result = await this.userOrchestrator.sendVerificationEmail({
            user: req.user,
            frontendBaseUrl,
        });
        if (!result.success) throw result.error;

        const message = 'Verification email sent successfully';
        res.status(200).json({
            success: true,
            message,
        });
        this.logger.info(message, { userId: req.user.id });
    };

    verifyEmail = async (req: Request<ParamsDictionary, unknown, VerifyEmailBody>, res: Response): Promise<void> => {
        const { token } = req.body;

        const result = await this.userOrchestrator.verifyEmail({ token });
        if (!result.success) throw result.error;
        const { user } = result.value;

        const message = 'Email verified successfully';
        res.status(200).json({
            success: true,
            message,
        });
        this.logger.info(message, { userId: user.id });
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
