import type { Router } from 'express';
import type { UpdateTransactionUseCase } from '../../../../application/transaction/update-transaction.use-case.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { Request, Response } from 'express';
import { getAuthenticatedUserId } from '../../helpers/auth.js';
import { validateRequest } from '../../helpers/validate-request.js';
import type { IdManager } from '../../../../domain/ports/id-manager.js';
import { updateTransactionSchema } from '../../../schemas/transaction.schemas.js';
import type { ApiSuccess } from '@shared/api/api-response.js';
import type { UpdateTransactionDto } from '@shared/dto/transaction/update.dto.js';
import { toUpdateTransactionDto } from '../../../mappers/transaction/update.mapper.js';

type Deps = {
    updateTransactionUseCase: UpdateTransactionUseCase;
    tokenManager: TokenManager;
    idManager: IdManager;
};

export const updateTransactionRoute = (router: Router, deps: Deps) => {
    /**
     * @openapi
     * /transactions/:transactionId:
     *   put:
     *     tags:
     *       - Transaction
     *     summary: Update transaction
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - value
     *               - type
     *             properties:
     *               name:
     *                 type: string
     *               value:
     *                 type: number
     *               type:
     *                 type: string
     *                 enum: [income, expense]
     *     responses:
     *       200:
     *         description: Transaction updated successfully
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
    router.put('/transactions/:transactionId', updateTransactionHandler(deps));
};

export const updateTransactionHandler = ({ updateTransactionUseCase, tokenManager, idManager }: Deps) => {
    return async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req, tokenManager);

        const { body, params } = validateRequest(req, updateTransactionSchema(idManager));

        const { transaction } = await updateTransactionUseCase.execute({ ...params, userId, ...body }, req.logger);

        const response: ApiSuccess<UpdateTransactionDto> = {
            success: true,
            data: toUpdateTransactionDto(transaction),
        };
        res.status(200).json(response);
    };
};
