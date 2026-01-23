import type { Router } from 'express';
import { type ReadTransactionDeps, readTransactionHandler } from '../../handlers/transaction/read.handler.js';

export const readTransactionRoute = (router: Router, deps: ReadTransactionDeps) => {
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
