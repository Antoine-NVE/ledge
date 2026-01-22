import type { Router } from 'express';
import {
    type ReadAllTransactionsDeps,
    readAllTransactionsHandler,
} from '../../handlers/transaction/read-all.handler.js';

export const readAllTransactionRoute = (router: Router, deps: ReadAllTransactionsDeps) => {
    /**
     * @openapi
     * /transaction:
     *   get:
     *     tags:
     *       - Transaction
     *     summary: Read all
     *     responses:
     *       200:
     *         description: Transactions retrieved successfully
     *       400:
     *         description: Invalid JWT payload
     *       401:
     *         description: Required access token / Inactive, invalid or expired JWT / User not found
     *       500:
     *         description: Internal server error
     */
    router.get('/transactions', readAllTransactionsHandler(deps));
};
