import type { DeleteTransactionUseCase } from '../../../../application/transaction/delete-transaction.use-case.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { IdManager } from '../../../../domain/ports/id-manager.js';
import type { Request, Response } from 'express';
import { deleteSchema } from '../../../schemas/transaction.schemas.js';
import type { ApiSuccess } from '../../../types/api-response.js';
import type { DeleteDto } from '../../../dto/transaction/delete.dto.js';
import { toDeleteDto } from '../../../mappers/transaction/delete.mapper.js';
import { getAuthenticatedUserId } from '../../helpers/auth.js';
import { validateRequest } from '../../helpers/validate-request.js';

export type DeleteTransactionDeps = {
    deleteTransactionUseCase: DeleteTransactionUseCase;
    tokenManager: TokenManager;
    idManager: IdManager;
};

export const deleteTransactionHandler = ({
    deleteTransactionUseCase,
    tokenManager,
    idManager,
}: DeleteTransactionDeps) => {
    return async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req, tokenManager);

        const { params } = validateRequest(req, deleteSchema(idManager));

        const { transaction } = await deleteTransactionUseCase.execute({ ...params, userId });

        const response: ApiSuccess<DeleteDto> = {
            success: true,
            data: toDeleteDto(transaction),
        };
        res.status(200).json(response);
    };
};
