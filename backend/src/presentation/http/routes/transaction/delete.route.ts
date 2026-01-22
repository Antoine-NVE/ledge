import type { Router } from 'express';
import { type DeleteTransactionDeps, deleteTransactionHandler } from '../../handlers/transaction/delete.handler.js';

export const deleteTransactionRoute = (router: Router, deps: DeleteTransactionDeps) => {
    /**
     * @openapi
     * /transaction/:id:
     *   delete:
     *     tags:
     *       - Transaction
     *     summary: Delete
     *     responses:
     *       200:
     *         description: Transaction deleted successfully
     *       400:
     *         description: Invalid JWT payload / Invalid parameters
     *       401:
     *         description: Required access token / Inactive, invalid or expired JWT / User not found
     *       403:
     *         description: Forbidden access
     *       404:
     *         description: Transaction not found
     *       500:
     *         description: Internal server error
     */
    router.delete('/transactions/:transactionId', deleteTransactionHandler(deps));
};
