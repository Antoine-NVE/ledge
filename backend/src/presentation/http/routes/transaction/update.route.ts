import type { UpdateTransactionUseCase } from '../../../../application/transaction/update-transaction.use-case.js';
import type { TokenManager } from '../../../../domain/ports/token-manager.js';
import type { IdManager } from '../../../../domain/ports/id-manager.js';
import type { Router } from 'express';
import { updateTransactionHandler } from '../../handlers/transaction/update.handler.js';

type Deps = {
    updateTransactionUseCase: UpdateTransactionUseCase;
    tokenManager: TokenManager;
    idManager: IdManager;
};

export const updateTransactionRoute = (router: Router, deps: Deps) => {
    /**
     * @openapi
     * /transaction/:id:
     *   put:
     *     tags:
     *       - Transaction
     *     summary: Update
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
     *         description: Invalid JWT payload / Invalid parameters / Validation error
     *       401:
     *         description: Required access token / Inactive, invalid or expired JWT / User not found
     *       403:
     *         description: Forbidden access
     *       404:
     *         description: Transaction not found
     *       500:
     *         description: Internal server error
     */
    router.put('/transactions/:transactionId', updateTransactionHandler(deps));
};
