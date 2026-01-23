import type { UpdateTransactionUseCase } from '../../../../application/transaction/update-transaction.use-case.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { Request, Response } from 'express';
import type { ApiSuccess } from '../../../types/api-response.js';
import type { UpdateDto } from '../../../dto/transaction/update.dto.js';
import { toUpdateDto } from '../../../mappers/transaction/update.mapper.js';
import { getAuthenticatedUserId } from '../../helpers/auth.js';
import { validateRequest } from '../../helpers/validate-request.js';
import type { IdManager } from '../../../../domain/ports/id-manager.js';
import { updateTransactionSchema } from '../../../schemas/transaction.schemas.js';

export type UpdateTransactionDeps = {
    updateTransactionUseCase: UpdateTransactionUseCase;
    tokenManager: TokenManager;
    idManager: IdManager;
};

export const updateTransactionHandler = ({
    updateTransactionUseCase,
    tokenManager,
    idManager,
}: UpdateTransactionDeps) => {
    return async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req, tokenManager);

        const { body, params } = validateRequest(req, updateTransactionSchema(idManager));

        const { transaction } = await updateTransactionUseCase.execute({ ...params, userId, ...body });

        const response: ApiSuccess<UpdateDto> = {
            success: true,
            data: toUpdateDto(transaction),
        };
        res.status(200).json(response);
    };
};
