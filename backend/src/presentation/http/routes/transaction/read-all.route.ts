import type { Router } from 'express';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { GetUserTransactionsUseCase } from '../../../../application/transaction/get-user-transactions.use-case.js';
import type { Request, Response } from 'express';
import type { ApiSuccess } from '@shared/api/api-response.js';
import type { ReadAllTransactionsDto } from '@shared/dto/transaction/read-all.dto.js';
import { toReadAllTransactionsDto } from '../../../mappers/transaction/read-all.mapper.js';
import { readAllTransactionsSchema } from '../../../schemas/transaction.schemas.js';
import { validateOrThrow } from '../../helpers/validate.js';
import { authenticateOrThrow } from '../../helpers/authenticate.js';

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
     *       401:
     *         description: Authentication error
     *       500:
     *         description: Internal server error
     */
    router.get('/transactions', readAllTransactionsHandler(deps));
};

export const readAllTransactionsHandler = ({ getUserTransactionsUseCase, tokenManager }: Deps) => {
    return async (req: Request, res: Response) => {
        const { cookies } = validateOrThrow(req, readAllTransactionsSchema());
        const { userId } = authenticateOrThrow(tokenManager, cookies.accessToken);

        const { transactions } = await getUserTransactionsUseCase.execute({ userId });

        const response: ApiSuccess<ReadAllTransactionsDto> = {
            success: true,
            data: toReadAllTransactionsDto(transactions),
        };
        res.status(200).json(response);
    };
};
