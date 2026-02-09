import type { Router } from 'express';
import type { CreateTransactionUseCase } from '../../../../application/transaction/create-transaction.use-case.js';
import type { Request, Response } from 'express';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import { createTransactionSchema } from '../../../schemas/transaction.schemas.js';
import type { ApiSuccess } from '@shared/api/api-response.js';
import type { CreateTransactionDto } from '@shared/dto/transaction/create.dto.js';
import { toCreateTransactionDto } from '../../../mappers/transaction/create.mapper.js';
import { treeifyError } from 'zod';
import { UnauthorizedError } from '../../errors/unauthorized.error.js';
import { BadRequestError } from '../../errors/bad-request.error.js';

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
        const validation = createTransactionSchema().safeParse(req);
        if (!validation.success) throw new BadRequestError(treeifyError(validation.error));
        const { body, cookies } = validation.data;

        if (!cookies.accessToken) throw new UnauthorizedError();

        const authentication = tokenManager.verifyAccess(cookies.accessToken);
        if (!authentication.success) throw new UnauthorizedError();
        const { userId } = authentication.data;

        const { transaction } = await createTransactionUseCase.execute(
            {
                userId,
                month: body.month,
                name: body.name,
                value: body.value,
                ...(body.type === 'expense'
                    ? { type: 'expense', expenseCategory: body.expenseCategory }
                    : { type: 'income', expenseCategory: null }),
            },
            req.logger,
        );

        const response: ApiSuccess<CreateTransactionDto> = {
            success: true,
            data: toCreateTransactionDto(transaction),
        };
        res.status(201).json(response);
    };
};
