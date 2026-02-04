import type { Router } from 'express';
import type { DeleteTransactionUseCase } from '../../../../application/transaction/delete-transaction.use-case.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { IdManager } from '../../../../domain/ports/id-manager.js';
import type { Request, Response } from 'express';
import { deleteTransactionSchema } from '../../../schemas/transaction.schemas.js';
import type { ApiError, ApiSuccess } from '@shared/api/api-response.js';
import type { DeleteTransactionDto } from '@shared/dto/transaction/delete.dto.js';
import { toDeleteTransactionDto } from '../../../mappers/transaction/delete.mapper.js';
import { treeifyError } from 'zod';

type Deps = {
    deleteTransactionUseCase: DeleteTransactionUseCase;
    tokenManager: TokenManager;
    idManager: IdManager;
};

export const deleteTransactionRoute = (router: Router, deps: Deps) => {
    /**
     * @openapi
     * /transactions/:transactionId:
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
        const validation = deleteTransactionSchema(idManager).safeParse(req);
        if (!validation.success) {
            const response: ApiError = {
                success: false,
                code: 'BAD_REQUEST',
                tree: treeifyError(validation.error),
            };
            res.status(400).json(response);
            return;
        }
        const { params, cookies } = validation.data;

        if (!cookies.accessToken) {
            const response: ApiError = {
                success: false,
                code: 'UNAUTHORIZED',
            };
            res.status(401).json(response);
            return;
        }

        const authentication = tokenManager.verifyAccess(cookies.accessToken);
        if (!authentication.success) {
            const response: ApiError = {
                success: false,
                code: 'UNAUTHORIZED',
            };
            res.status(401).json(response);
            return;
        }
        const { userId } = authentication.data;

        const deletion = await deleteTransactionUseCase.execute(
            { transactionId: params.transactionId, userId },
            req.logger,
        );
        if (!deletion.success) {
            switch (deletion.error.type) {
                case 'TRANSACTION_NOT_OWNED': {
                    const response: ApiError = {
                        success: false,
                        code: 'FORBIDDEN',
                    };
                    res.status(403).json(response);
                    return;
                }
                case 'TRANSACTION_NOT_FOUND': {
                    const response: ApiError = {
                        success: false,
                        code: 'TRANSACTION_NOT_FOUND',
                    };
                    res.status(404).json(response);
                    return;
                }
            }
        }
        const { transaction } = deletion.data;

        const response: ApiSuccess<DeleteTransactionDto> = {
            success: true,
            data: toDeleteTransactionDto(transaction),
        };
        res.status(200).json(response);
    };
};
