import type { Router } from 'express';
import type { DeleteTransactionUseCase } from '../../../../application/transaction/delete-transaction.use-case.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { IdManager } from '../../../../domain/ports/id-manager.js';
import type { Request, Response } from 'express';
import type { ApiSuccess } from '../../../types/api-response.js';
import type { DeleteDto } from '../../../dto/transaction/delete.dto.js';
import { toDeleteDto } from '../../../mappers/transaction/delete.mapper.js';
import { getAuthenticatedUserId } from '../../helpers/auth.js';
import { validateRequest } from '../../helpers/validate-request.js';
import { deleteTransactionSchema } from '../../../schemas/transaction.schemas.js';

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
     *         description: Invalid JWT payload / Invalid parameters
     *       401:
     *         description: Required access token / Inactive, invalid or expired JWT / User not found
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

        const { transaction } = await deleteTransactionUseCase.execute({ ...params, userId });

        const response: ApiSuccess<DeleteDto> = {
            success: true,
            data: toDeleteDto(transaction),
        };
        res.status(200).json(response);
    };
};
