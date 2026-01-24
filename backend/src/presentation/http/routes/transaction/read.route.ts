import type { Router } from 'express';
import type { GetTransactionUseCase } from '../../../../application/transaction/get-transaction.use-case.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { Request, Response } from 'express';
import { getAuthenticatedUserId } from '../../helpers/auth.js';
import { validateRequest } from '../../helpers/validate-request.js';
import type { IdManager } from '../../../../domain/ports/id-manager.js';
import { readTransactionSchema } from '../../../schemas/transaction.schemas.js';
import type { ApiSuccess } from '@shared/api/api-response.js';
import type { ReadTransactionDto } from '@shared/dto/transaction/read.dto.js';
import { toReadTransactionDto } from '../../../mappers/transaction/read.mapper.js';

type Deps = {
    getTransactionUseCase: GetTransactionUseCase;
    tokenManager: TokenManager;
    idManager: IdManager;
};

export const readTransactionRoute = (router: Router, deps: Deps) => {
    /**
     * @openapi
     * /transactions/:id:
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
        const userId = getAuthenticatedUserId(req, tokenManager);

        const { params } = validateRequest(req, readTransactionSchema(idManager));

        const { transaction } = await getTransactionUseCase.execute({ ...params, userId });

        const response: ApiSuccess<ReadTransactionDto> = {
            success: true,
            data: toReadTransactionDto(transaction),
        };
        res.status(200).json(response);
    };
};
