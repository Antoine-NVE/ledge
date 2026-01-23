import type { Router } from 'express';
import { type CreateTransactionDeps, createTransactionHandler } from '../../handlers/transaction/create.handler.js';

export const createTransactionRoute = (router: Router, deps: CreateTransactionDeps) => {
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
