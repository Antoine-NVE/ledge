import type { Router } from 'express';
import type { Request, Response } from 'express';
import { loginSchema } from '../../../schemas/auth.schemas.js';
import { setAuthCookies } from '../../helpers/cookies.js';
import type { LoginUseCase } from '../../../../application/auth/login.use-case.js';
import type { ApiSuccess } from '@shared/api/api-response.js';
import { InvalidCredentialsError } from '../../errors/invalid-credentials.error.js';
import { validateOrThrow } from '../../helpers/validate.js';
import type { UserDto } from '@shared/dto/user.dto.js';
import { toUserDto } from '../../../mappers/user.mapper.js';

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
        const { body } = validateOrThrow(req, loginSchema());

        const result = await loginUseCase.execute({ email: body.email, password: body.password }, req.logger);
        if (!result.success) {
            switch (result.error) {
                case 'USER_NOT_FOUND':
                case 'INVALID_PASSWORD':
                    throw new InvalidCredentialsError();
            }
        }
        const { user, accessToken, refreshToken } = result.data;

        setAuthCookies(res, accessToken, refreshToken, body.rememberMe);

        const response: ApiSuccess<UserDto> = {
            success: true,
            data: toUserDto(user),
        };
        res.status(200).json(response);
    };
};
