import type { Router } from 'express';
import type { Request, Response } from 'express';
import { loginSchema } from '../../../schemas/auth.schemas.js';
import { toLoginDto } from '../../../mappers/auth/login.mapper.js';
import { setAuthCookies } from '../../helpers/cookies.js';
import type { LoginUseCase } from '../../../../application/auth/login.use-case.js';
import type { ApiSuccess } from '@shared/api/api-response.js';
import type { LoginDto } from '@shared/dto/auth/login.dto.js';
import { treeifyError } from 'zod';
import { BadRequestError } from '../../errors/bad-request.error.js';
import { InvalidCredentialsError } from '../../errors/invalid-credentials.error.js';

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
        if (!validation.success) throw new BadRequestError(treeifyError(validation.error));
        const { body } = validation.data;

        const login = await loginUseCase.execute({ email: body.email, password: body.password }, req.logger);
        if (!login.success) {
            switch (login.error) {
                case 'USER_NOT_FOUND':
                case 'INVALID_PASSWORD':
                    throw new InvalidCredentialsError();
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
