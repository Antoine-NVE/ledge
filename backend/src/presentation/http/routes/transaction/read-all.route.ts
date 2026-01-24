import type { Router } from 'express';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { GetUserTransactionsUseCase } from '../../../../application/transaction/get-user-transactions.use-case.js';
import type { Request, Response } from 'express';
import type { ApiSuccess } from '../../../types/api-response.js';
import type { ReadAllDto } from '../../../dto/transaction/read-all.dto.js';
import { toReadAllDto } from '../../../mappers/transaction/read-all.mapper.js';
import { getAuthenticatedUserId } from '../../helpers/auth.js';

type Deps = {
    getUserTransactionsUseCase: GetUserTransactionsUseCase;
    tokenManager: TokenManager;
};

export const readAllTransactionRoute = (router: Router, deps: Deps) => {
    /**
     * @openapi
     * /transactions:
     *   get:
     *     tags:
     *       - Transaction
     *     summary: Read all transactions
     *     responses:
     *       200:
     *         description: Transactions retrieved successfully
     *       400:
     *         description: Invalid JWT payload
     *       401:
     *         description: Required access token / Inactive, invalid or expired JWT / User not found
     *       500:
     *         description: Internal server error
     */
    router.get('/transactions', readAllTransactionsHandler(deps));
};

export const readAllTransactionsHandler = ({ getUserTransactionsUseCase, tokenManager }: Deps) => {
    return async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req, tokenManager);

        const { transactions } = await getUserTransactionsUseCase.execute({ userId });

        const response: ApiSuccess<ReadAllDto> = {
            success: true,
            data: toReadAllDto(transactions),
        };
        res.status(200).json(response);
    };
};
