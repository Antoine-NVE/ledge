import type { Router } from 'express';
import type { GetCurrentUserUseCase } from '../../../../application/user/get-current-user.use-case.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { Request, Response } from 'express';
import type { ApiSuccess } from '../../../types/api-response.js';
import type { MeDto } from '../../../dto/user/me.dto.js';
import { toMeDto } from '../../../mappers/user/me.mapper.js';
import { getAuthenticatedUserId } from '../../helpers/auth.js';

type Deps = {
    getCurrentUserUseCase: GetCurrentUserUseCase;
    tokenManager: TokenManager;
};

export const meRoute = (router: Router, deps: Deps) => {
    /**
     * @openapi
     * /users/me:
     *   get:
     *     tags:
     *       - User
     *     summary: Me
     *     responses:
     *       200:
     *         description: User retrieved successfully
     *       401:
     *         description: Required access token / User not found / Inactive, invalid or expired JWT
     *       500:
     *         description: Internal server error
     */
    router.get('/users/me', meHandler(deps));
};

export const meHandler = ({ getCurrentUserUseCase, tokenManager }: Deps) => {
    return async (req: Request, res: Response): Promise<void> => {
        const userId = getAuthenticatedUserId(req, tokenManager);

        const { user } = await getCurrentUserUseCase.execute({ userId });

        const response: ApiSuccess<MeDto> = {
            success: true,
            data: toMeDto(user),
        };
        res.status(200).json(response);
    };
};
