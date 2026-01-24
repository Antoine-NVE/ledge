import type { Router } from 'express';
import type { CreateTransactionUseCase } from '../../../../application/transaction/create-transaction.use-case.js';
import type { Request, Response } from 'express';
import { validateRequest } from '../../helpers/validate-request.js';
import { getAuthenticatedUserId } from '../../helpers/auth.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import { createTransactionSchema } from '../../../schemas/transaction.schemas.js';
import type { ApiSuccess } from '@shared/api/api-response.js';
import type { CreateTransactionDto } from '@shared/dto/transaction/create.dto.js';
import { toCreateTransactionDto } from '../../../mappers/transaction/create.mapper.js';

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
     *         description: Validation error / Invalid JWT payload
     *       401:
     *         description: Required access token / Inactive, invalid or expired JWT / User not found
     *       500:
     *         description: Internal server error
     */
    router.post('/transactions', createTransactionHandler(deps));
};

export const createTransactionHandler = ({ createTransactionUseCase, tokenManager }: Deps) => {
    return async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req, tokenManager);

        const { body } = validateRequest(req, createTransactionSchema());

        const { transaction } = await createTransactionUseCase.execute({ userId, ...body });

        const response: ApiSuccess<CreateTransactionDto> = {
            success: true,
            data: toCreateTransactionDto(transaction),
        };
        res.status(201).json(response);
    };
};
