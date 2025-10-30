import { Request, Response } from 'express';
import { UserOrchestrator } from '../../application/user/user-orchestrator';
import { removePasswordHash } from '../../infrastructure/utils/clean-utils';
import { SendVerificationEmailBody, VerifyEmailBody } from './user-types';
import { ParamsDictionary } from 'express-serve-static-core';

export class UserController {
    constructor(private userOrchestrator: UserOrchestrator) {}

    sendVerificationEmail = async (
        req: Request<ParamsDictionary, unknown, SendVerificationEmailBody>,
        res: Response,
    ): Promise<void> => {
        const { frontendBaseUrl } = req.body;

        await this.userOrchestrator.sendVerificationEmail(
            req.user,
            frontendBaseUrl,
        );

        res.status(200).json({
            message: 'Verification email sent successfully',
        });
    };

    verifyEmail = async (
        req: Request<ParamsDictionary, unknown, VerifyEmailBody>,
        res: Response,
    ): Promise<void> => {
        const { jwt } = req.body;

        await this.userOrchestrator.verifyEmail(jwt);

        res.status(200).json({
            message: 'Email verified successfully',
        });
    };

    me = async (req: Request, res: Response): Promise<void> => {
        res.status(200).json({
            message: 'User retrieved successfully',
            data: {
                user: removePasswordHash(req.user),
            },
        });
    };
}
