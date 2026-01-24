import type { Router } from 'express';
import type { GetTransactionUseCase } from '../../../../application/transaction/get-transaction.use-case.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { Request, Response } from 'express';
import type { ApiSuccess } from '../../../types/api-response.js';
import type { ReadDto } from '../../../dto/transaction/read.dto.js';
import { toReadDto } from '../../../mappers/transaction/read.mapper.js';
import { getAuthenticatedUserId } from '../../helpers/auth.js';
import { validateRequest } from '../../helpers/validate-request.js';
import type { IdManager } from '../../../../domain/ports/id-manager.js';
import { readTransactionSchema } from '../../../schemas/transaction.schemas.js';

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
     *         description: Invalid parameters / Invalid JWT payload
     *       401:
     *         description: Required access token / Inactive, invalid or expired JWT / User not found
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

        const response: ApiSuccess<ReadDto> = {
            success: true,
            data: toReadDto(transaction),
        };
        res.status(200).json(response);
    };
};
