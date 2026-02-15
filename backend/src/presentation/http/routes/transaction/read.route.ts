import type { Router } from 'express';
import type { GetTransactionUseCase } from '../../../../application/transaction/get-transaction.use-case.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { Request, Response } from 'express';
import type { IdManager } from '../../../../domain/ports/id-manager.js';
import { readTransactionSchema } from '../../../schemas/transaction.schemas.js';
import type { ApiSuccess } from '@shared/api/api-response.js';
import { ForbiddenError } from '../../errors/forbidden.error.js';
import { TransactionNotFoundError } from '../../errors/transaction-not-found.error.js';
import { validateOrThrow } from '../../helpers/validate.js';
import { authenticateOrThrow } from '../../helpers/authenticate.js';
import type { TransactionDto } from '@shared/dto/transaction.dto.js';
import { toTransactionDto } from '../../../mappers/transaction.mapper.js';

type Deps = {
    getTransactionUseCase: GetTransactionUseCase;
    tokenManager: TokenManager;
    idManager: IdManager;
};

export const readTransactionRoute = (router: Router, deps: Deps) => {
    /**
     * @openapi
     * /transactions/:transactionId:
     *   get:
     *     tags:
     *       - Transaction
     *     summary: Read transaction
     *     responses:
     *       200:
     *         description: Transaction retrieved successfully
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
    router.get('/transactions/:transactionId', readTransactionHandler(deps));
};

export const readTransactionHandler = ({ getTransactionUseCase, tokenManager, idManager }: Deps) => {
    return async (req: Request, res: Response) => {
        const { params, cookies } = validateOrThrow(req, readTransactionSchema(idManager));
        const { userId } = authenticateOrThrow(tokenManager, cookies.accessToken);

        const result = await getTransactionUseCase.execute({ transactionId: params.transactionId, userId });
        if (!result.success) {
            switch (result.error) {
                case 'TRANSACTION_NOT_OWNED':
                    throw new ForbiddenError();
                case 'TRANSACTION_NOT_FOUND':
                    throw new TransactionNotFoundError();
            }
        }
        const { transaction } = result.data;

        const response: ApiSuccess<TransactionDto> = {
            success: true,
            data: toTransactionDto(transaction),
        };
        res.status(200).json(response);
    };
};
