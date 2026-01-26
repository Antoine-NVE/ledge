import type { Router } from 'express';
import type { Request, Response } from 'express';
import { loginSchema } from '../../../schemas/auth.schemas.js';
import { toLoginDto } from '../../../mappers/auth/login.mapper.js';
import { setAuthCookies } from '../../helpers/auth-cookies.js';
import type { LoginUseCase } from '../../../../application/auth/login.use-case.js';
import type { ApiError, ApiSuccess } from '@shared/api/api-response.js';
import type { LoginDto } from '@shared/dto/auth/login.dto.js';
import { treeifyError } from 'zod';

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
        const validation = loginSchema().safeParse(req);
        if (!validation.success) {
            const response: ApiError = {
                success: false,
                code: 'VALIDATION_ERROR',
                tree: treeifyError(validation.error),
            };
            res.status(400).json(response);
            return;
        }
        const { body } = validation.data;

        const login = await loginUseCase.execute(body, req.logger);
        if (!login.success) {
            switch (login.error.type) {
                case 'INVALID_CREDENTIALS': {
                    const response: ApiError = {
                        success: false,
                        code: 'INVALID_CREDENTIALS',
                    };
                    res.status(401).json(response);
                    return;
                }
            }
        }
        const { user, accessToken, refreshToken } = login.data;

        setAuthCookies(res, accessToken, refreshToken, body.rememberMe);

        const response: ApiSuccess<LoginDto> = {
            success: true,
            data: toLoginDto(user),
        };
        res.status(200).json(response);
    };
};
