import type { VerifyEmailUseCase } from '../../../../application/user/verify-email.use-case.js';
import type { Request, Response } from 'express';
import { verifyEmailSchema } from '../../../schemas/user.schemas.js';
import type { ApiSuccess } from '../../../types/api-response.js';
import { validateRequest } from '../../helpers/validate-request.js';

export type VerifyEmailDeps = {
    verifyEmailUseCase: VerifyEmailUseCase;
};

export const verifyEmailHandler = ({ verifyEmailUseCase }: VerifyEmailDeps) => {
    return async (req: Request, res: Response): Promise<void> => {
        const { body } = validateRequest(req, verifyEmailSchema());

        await verifyEmailUseCase.execute({ emailVerificationToken: body.token });

        const response: ApiSuccess = {
            success: true,
        };
        res.status(200).json(response);
    };
};
