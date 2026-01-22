import type { RefreshUseCase } from '../../../../application/auth/refresh.use-case.js';
import type { Request, Response } from 'express';
import { AuthenticationError } from '../../../../application/errors/authentication.error.js';
import type { ApiSuccess } from '../../../types/api-response.js';
import { findRefreshToken, findRememberMe, setAuthCookies } from '../../helpers/auth-cookies.js';

export type RefreshDeps = {
    refreshUseCase: RefreshUseCase;
};

export const refreshHandler = ({ refreshUseCase }: RefreshDeps) => {
    return async (req: Request, res: Response) => {
        const refreshToken = findRefreshToken(req);
        if (!refreshToken) throw new AuthenticationError();

        const rememberMe = findRememberMe(req);

        const output = await refreshUseCase.execute({ refreshToken });

        setAuthCookies(res, output.accessToken, output.refreshToken, rememberMe);

        const response: ApiSuccess = {
            success: true,
        };
        res.status(200).json(response);
    };
};
