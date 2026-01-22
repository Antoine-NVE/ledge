import type { RegisterUseCase } from '../../../../application/auth/register.use-case.js';
import { validateRequest } from '../../helpers/validate-request.js';
import { registerSchema } from '../../../schemas/auth.schemas.js';
import { setAuthCookies } from '../../helpers/auth-cookies.js';
import type { ApiSuccess } from '../../../types/api-response.js';
import type { RegisterDto } from '../../../dto/auth/register.dto.js';
import { toRegisterDto } from '../../../mappers/auth/register.mapper.js';
import type { Request, Response } from 'express';

export type RegisterDeps = {
    registerUseCase: RegisterUseCase;
};

export const registerHandler = ({ registerUseCase }: RegisterDeps) => {
    return async (req: Request, res: Response) => {
        const { body } = validateRequest(req, registerSchema());

        const { user, accessToken, refreshToken } = await registerUseCase.execute(body);

        setAuthCookies(res, accessToken, refreshToken, false);

        const response: ApiSuccess<RegisterDto> = {
            success: true,
            data: toRegisterDto(user),
        };
        res.status(201).json(response);
    };
};
