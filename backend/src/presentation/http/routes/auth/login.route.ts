import type { Router } from 'express';
import type { Request, Response } from 'express';
import { loginSchema } from '../../../schemas/auth.schemas.js';
import { toLoginDto } from '../../../mappers/auth/login.mapper.js';
import { validateRequest } from '../../helpers/validate-request.js';
import { setAuthCookies } from '../../helpers/auth-cookies.js';
import type { LoginUseCase } from '../../../../application/auth/login.use-case.js';
import type { ApiSuccess } from '@shared/api/api-response.js';
import type { LoginDto } from '@shared/dto/auth/login.dto.js';

type Deps = {
    loginUseCase: LoginUseCase;
};

export const loginRoute = (router: Router, deps: Deps) => {
    /**
     * @openapi
     * /auth/login:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Login
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *               - rememberMe
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               rememberMe:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: User logged in successfully
     *       400:
     *         description: Validation error
     *       401:
     *         description: Invalid credentials
     *       500:
     *         description: Internal server error
     */
    router.post('/auth/login', loginHandler(deps));
};

export const loginHandler = ({ loginUseCase }: Deps) => {
    return async (req: Request, res: Response) => {
        const { body } = validateRequest(req, loginSchema());

        const { user, accessToken, refreshToken } = await loginUseCase.execute(body, req.logger);

        setAuthCookies(res, accessToken, refreshToken, body.rememberMe);

        const response: ApiSuccess<LoginDto> = {
            success: true,
            data: toLoginDto(user),
        };
        res.status(200).json(response);
    };
};
