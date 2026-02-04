import type { Router } from 'express';
import type { GetTransactionUseCase } from '../../../../application/transaction/get-transaction.use-case.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { Request, Response } from 'express';
import type { IdManager } from '../../../../domain/ports/id-manager.js';
import { readTransactionSchema } from '../../../schemas/transaction.schemas.js';
import type { ApiError, ApiSuccess } from '@shared/api/api-response.js';
import type { ReadTransactionDto } from '@shared/dto/transaction/read.dto.js';
import { toReadTransactionDto } from '../../../mappers/transaction/read.mapper.js';
import { treeifyError } from 'zod';

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
        const validation = readTransactionSchema(idManager).safeParse(req);
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

        const getting = await getTransactionUseCase.execute({ transactionId: params.transactionId, userId });
        if (!getting.success) {
            switch (getting.error.type) {
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
        const { transaction } = getting.data;

        const response: ApiSuccess<ReadTransactionDto> = {
            success: true,
            data: toReadTransactionDto(transaction),
        };
        res.status(200).json(response);
    };
};
