import express from 'express';
import type { TransactionController } from '../controllers/transaction-controller.js';

export const createTransactionRoutes = (transactionController: TransactionController) => {
    const router = express.Router();

    /**
     * @openapi
     * /transaction:
     *   post:
     *     tags:
     *       - Transaction
     *     summary: Create
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
    router.post('/', transactionController.create);

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
    router.get('/', transactionController.readAll);

    /**
     * @openapi
     * /transaction/:id:
     *   get:
     *     tags:
     *       - Transaction
     *     summary: Read
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
    router.get('/:transactionId', transactionController.read);

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
    router.put('/:transactionId', transactionController.update);

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
    router.delete('/:transactionId', transactionController.delete);

    return router;
};
