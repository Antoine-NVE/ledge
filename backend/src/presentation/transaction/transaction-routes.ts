import express from 'express';
import { createBodySchema, updateBodySchema } from './transaction-schemas';
import { Container } from '../../infrastructure/types/container-type';
import { createValidateParamsMiddleware } from '../middlewares/business/validate-params';
import { createValidateBodyMiddleware } from '../middlewares/business/validate-body';
import { authorizeParamsSchema } from '../middlewares/business/authorize';

export const createTransactionRoutes = (container: Container) => {
    const router = express.Router();

    const { authenticate, authorize } = container;
    const {
        create,
        readAll,
        read,
        update,
        delete: remove,
    } = container.transactionController;
    const validateParams = createValidateParamsMiddleware(
        authorizeParamsSchema,
    );

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
    router.post(
        '/',
        authenticate,
        createValidateBodyMiddleware(createBodySchema),
        create,
    );

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
    router.get('/', authenticate, readAll);

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
    router.get('/:id', authenticate, validateParams, authorize, read);

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
    router.put(
        '/:id',
        authenticate,
        validateParams,
        authorize,
        createValidateBodyMiddleware(updateBodySchema),
        update,
    );

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
    router.delete('/:id', authenticate, validateParams, authorize, remove);

    return router;
};
