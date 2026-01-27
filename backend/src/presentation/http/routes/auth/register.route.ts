import type { Router } from 'express';
import type { RegisterUseCase } from '../../../../application/auth/register.use-case.js';
import { registerSchema } from '../../../schemas/auth.schemas.js';
import { setAuthCookies } from '../../helpers/auth-cookies.js';
import { toRegisterDto } from '../../../mappers/auth/register.mapper.js';
import type { Request, Response } from 'express';
import type { ApiError, ApiSuccess } from '@shared/api/api-response.js';
import type { RegisterDto } from '@shared/dto/auth/register.dto.js';
import { treeifyError } from 'zod';

type Deps = {
    registerUseCase: RegisterUseCase;
};

export const registerRoute = (router: Router, deps: Deps) => {
    /**
     * @openapi
     * /auth/register:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Register
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *               - confirmPassword
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               confirmPassword:
     *                 type: string
     *     responses:
     *       201:
     *         description: User registered successfully
     *       400:
     *         description: Validation error
     *       409:
     *         description: Duplicate email
     *       500:
     *         description: Internal server error
     */
    router.post('/auth/register', registerHandler(deps));
};

export const registerHandler = ({ registerUseCase }: Deps) => {
    return async (req: Request, res: Response) => {
        const validation = registerSchema().safeParse(req);
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

        const registration = await registerUseCase.execute(body, req.logger);
        if (!registration.success) {
            switch (registration.error.type) {
                case 'DUPLICATE_EMAIL': {
                    const response: ApiError = {
                        success: false,
                        code: 'DUPLICATE_EMAIL',
                    };
                    res.status(409).json(response);
                    return;
                }
            }
        }
        const { user, accessToken, refreshToken } = registration.data;

        setAuthCookies(res, accessToken, refreshToken, false);

        const response: ApiSuccess<RegisterDto> = {
            success: true,
            data: toRegisterDto(user),
        };
        res.status(201).json(response);
    };
};
