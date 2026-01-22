import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { GetUserTransactionsUseCase } from '../../../../application/transaction/get-user-transactions.use-case.js';
import type { Request, Response } from 'express';
import type { ApiSuccess } from '../../../types/api-response.js';
import type { ReadAllDto } from '../../../dto/transaction/read-all.dto.js';
import { toReadAllDto } from '../../../mappers/transaction/read-all.mapper.js';
import { getAuthenticatedUserId } from '../../helpers/auth.js';

export type ReadAllTransactionsDeps = {
    getUserTransactionsUseCase: GetUserTransactionsUseCase;
    tokenManager: TokenManager;
};

export const readAllTransactionsHandler = ({ getUserTransactionsUseCase, tokenManager }: ReadAllTransactionsDeps) => {
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
