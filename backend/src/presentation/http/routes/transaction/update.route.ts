import type { Router } from 'express';
import type { UpdateTransactionUseCase } from '../../../../application/transaction/update-transaction.use-case.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { Request, Response } from 'express';
import type { IdManager } from '../../../../domain/ports/id-manager.js';
import { updateTransactionSchema } from '../../../schemas/transaction.schemas.js';
import type { ApiSuccess } from '@shared/api/api-response.js';
import type { UpdateTransactionDto } from '@shared/dto/transaction/update.dto.js';
import { toUpdateTransactionDto } from '../../../mappers/transaction/update.mapper.js';
import { treeifyError } from 'zod';
import { BadRequestError } from '../../errors/bad-request.error.js';
import { UnauthorizedError } from '../../errors/unauthorized.error.js';
import { ForbiddenError } from '../../errors/forbidden.error.js';
import { TransactionNotFoundError } from '../../errors/transaction-not-found.error.js';

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
        const validation = updateTransactionSchema(idManager).safeParse(req);
        if (!validation.success) throw new BadRequestError(treeifyError(validation.error));
        const { body, params, cookies } = validation.data;

        if (!cookies.accessToken) throw new UnauthorizedError();

        const authentication = tokenManager.verifyAccess(cookies.accessToken);
        if (!authentication.success) throw new UnauthorizedError();
        const { userId } = authentication.data;

        const update = await updateTransactionUseCase.execute(
            {
                transactionId: params.transactionId,
                userId,
                name: body.name,
                value: body.value,
                ...(body.type === 'expense'
                    ? { type: 'expense', expenseCategory: body.expenseCategory }
                    : { type: 'income', expenseCategory: null }),
            },
            req.logger,
        );
        if (!update.success) {
            switch (update.error) {
                case 'TRANSACTION_NOT_OWNED':
                    throw new ForbiddenError();
                case 'TRANSACTION_NOT_FOUND':
                    throw new TransactionNotFoundError();
            }
        }
        const { transaction } = update.data;

        const response: ApiSuccess<UpdateTransactionDto> = {
            success: true,
            data: toUpdateTransactionDto(transaction),
        };
        res.status(200).json(response);
    };
};
