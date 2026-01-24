import type { Router } from 'express';
import type { DeleteTransactionUseCase } from '../../../../application/transaction/delete-transaction.use-case.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { IdManager } from '../../../../domain/ports/id-manager.js';
import type { Request, Response } from 'express';
import { getAuthenticatedUserId } from '../../helpers/auth.js';
import { validateRequest } from '../../helpers/validate-request.js';
import { deleteTransactionSchema } from '../../../schemas/transaction.schemas.js';
import type { ApiSuccess } from '@shared/api/api-response.js';
import type { DeleteTransactionDto } from '@shared/dto/transaction/delete.dto.js';
import { toDeleteTransactionDto } from '../../../mappers/transaction/delete.mapper.js';

type Deps = {
    deleteTransactionUseCase: DeleteTransactionUseCase;
    tokenManager: TokenManager;
    idManager: IdManager;
};

export const deleteTransactionRoute = (router: Router, deps: Deps) => {
    /**
     * @openapi
     * /transactions/:id:
     *   delete:
     *     tags:
     *       - Transaction
     *     summary: Delete transaction
     *     responses:
     *       200:
     *         description: Transaction deleted successfully
     *       400:
     *         description: Validation error
     *       401:
     *         description: Authentication error
     *       403:
     *         description: Forbidden access
     *       404:
     *         description: Transaction not found
     *       500:
     *         description: Internal server error
     */
    router.delete('/transactions/:transactionId', deleteTransactionHandler(deps));
};

export const deleteTransactionHandler = ({ deleteTransactionUseCase, tokenManager, idManager }: Deps) => {
    return async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req, tokenManager);

        const { params } = validateRequest(req, deleteTransactionSchema(idManager));

        const { transaction } = await deleteTransactionUseCase.execute({ ...params, userId }, req.logger);

        const response: ApiSuccess<DeleteTransactionDto> = {
            success: true,
            data: toDeleteTransactionDto(transaction),
        };
        res.status(200).json(response);
    };
};
