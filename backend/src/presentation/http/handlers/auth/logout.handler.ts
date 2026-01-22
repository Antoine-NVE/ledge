import type { Request, Response } from 'express';
import type { LogoutUseCase } from '../../../../application/auth/logout.use-case.js';
import type { ApiSuccess } from '../../../types/api-response.js';
import { clearAuthCookies, findRefreshToken } from '../../helpers/auth-cookies.js';

export type LogoutDeps = {
    logoutUseCase: LogoutUseCase;
};

export const logoutHandler = ({ logoutUseCase }: LogoutDeps) => {
    return async (req: Request, res: Response) => {
        const refreshToken = findRefreshToken(req);

        clearAuthCookies(res);

        if (refreshToken) await logoutUseCase.execute({ refreshToken });

        const response: ApiSuccess = {
            success: true,
        };
        res.status(200).json(response);
    };
};
