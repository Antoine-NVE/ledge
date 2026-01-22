import type { GetCurrentUserUseCase } from '../../../../application/user/get-current-user.use-case.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { Request, Response } from 'express';
import type { ApiSuccess } from '../../../types/api-response.js';
import type { MeDto } from '../../../dto/user/me.dto.js';
import { toMeDto } from '../../../mappers/user/me.mapper.js';
import { getAuthenticatedUserId } from '../../helpers/auth.js';

export type MeDeps = {
    getCurrentUserUseCase: GetCurrentUserUseCase;
    tokenManager: TokenManager;
};

export const meHandler = ({ getCurrentUserUseCase, tokenManager }: MeDeps) => {
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
