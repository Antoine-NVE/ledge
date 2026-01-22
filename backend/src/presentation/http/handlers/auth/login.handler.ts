import type { Request, Response } from 'express';
import { loginSchema } from '../../../schemas/auth.schemas.js';
import type { ApiSuccess } from '../../../types/api-response.js';
import type { LoginDto } from '../../../dto/auth/login.dto.js';
import { toLoginDto } from '../../../mappers/auth/login.mapper.js';
import { validateRequest } from '../../helpers/validate-request.js';
import { setAuthCookies } from '../../helpers/auth-cookies.js';
import type { LoginUseCase } from '../../../../application/auth/login.use-case.js';

export type LoginDeps = {
    loginUseCase: LoginUseCase;
};

export const loginHandler = ({ loginUseCase }: LoginDeps) => {
    return async (req: Request, res: Response) => {
        const { body } = validateRequest(req, loginSchema());

        const { user, accessToken, refreshToken } = await loginUseCase.execute(body);

        setAuthCookies(res, accessToken, refreshToken, body.rememberMe);

        const response: ApiSuccess<LoginDto> = {
            success: true,
            data: toLoginDto(user),
        };
        res.status(200).json(response);
    };
};
