import type { Router } from 'express';
import type { CreateTransactionUseCase } from '../../../../application/transaction/create-transaction.use-case.js';
import type { Request, Response } from 'express';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import { createTransactionSchema } from '../../../schemas/transaction.schemas.js';
import type { ApiError, ApiSuccess } from '@shared/api/api-response.js';
import type { CreateTransactionDto } from '@shared/dto/transaction/create.dto.js';
import { toCreateTransactionDto } from '../../../mappers/transaction/create.mapper.js';
import { findAccessToken } from '../../helpers/auth-cookies.js';
import { treeifyError } from 'zod';

type Deps = {
    createTransactionUseCase: CreateTransactionUseCase;
    tokenManager: TokenManager;
};

export const createTransactionRoute = (router: Router, deps: Deps) => {
    /**
     * @openapi
     * /transactions:
     *   post:
     *     tags:
     *       - Transaction
     *     summary: Create transaction
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - month
     *               - name
     *               - value
     *               - type
     *             properties:
     *               month:
     *                 type: string
     *               name:
     *                 type: string
     *               value:
     *                 type: number
     *               type:
     *                 type: string
     *                 enum: [income, expense]
     *     responses:
     *       201:
     *         description: Transaction created successfully
     *       400:
     *         description: Validation error
     *       401:
     *         description: Authentication error
     *       500:
     *         description: Internal server error
     */
    router.post('/transactions', createTransactionHandler(deps));
};

export const createTransactionHandler = ({ createTransactionUseCase, tokenManager }: Deps) => {
    return async (req: Request, res: Response) => {
        const accessToken = findAccessToken(req);
        if (!accessToken) {
            const response: ApiError = {
                success: false,
                code: 'UNAUTHORIZED',
            };
            res.status(401).json(response);
            return;
        }

        const verification = tokenManager.verifyAccess(accessToken);
        if (!verification.success) {
            const response: ApiError = {
                success: false,
                code: 'UNAUTHORIZED',
            };
            res.status(401).json(response);
            return;
        }
        const { userId } = verification.data;

        const validation = createTransactionSchema().safeParse(req);
        if (!validation.success) {
            const response: ApiError = {
                success: false,
                code: 'BAD_REQUEST',
                tree: treeifyError(validation.error),
            };
            res.status(400).json(response);
            return;
        }
        const { body } = validation.data;

        const { transaction } = await createTransactionUseCase.execute({ userId, ...body }, req.logger);

        const response: ApiSuccess<CreateTransactionDto> = {
            success: true,
            data: toCreateTransactionDto(transaction),
        };
        res.status(201).json(response);
    };
};
