import express from 'express';
import { container } from '../../infrastructure/config/container';
import { validateBody } from '../shared/middlewares/validate-body/validate-body-middleware';
import { createBodySchema, updateBodySchema } from './transaction-schemas';
import { authenticate } from '../shared/middlewares/authenticate/authenticate-middleware';
import { authorize } from '../shared/middlewares/authorize/authorize-middleware';
import { authorizeParamsSchema } from '../shared/middlewares/authorize/authorize-schemas';
import { validateParams } from '../shared/middlewares/validate-params/validate-params-middleware';

const router = express.Router();

const { jwtService, userService, transactionService } = container;
const {
    create,
    readAll,
    read,
    update,
    delete: remove,
} = container.transactionController;

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
 *               - isIncome
 *               - isRecurring
 *             properties:
 *               month:
 *                 type: string
 *               name:
 *                 type: string
 *               value:
 *                 type: number
 *               isIncome:
 *                 type: boolean
 *               isRecurring:
 *                 type: boolean
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
    authenticate(jwtService, userService),
    validateBody(createBodySchema),
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
router.get('/', authenticate(jwtService, userService), readAll);

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
router.get(
    '/:id',
    authenticate(jwtService, userService),
    validateParams(authorizeParamsSchema),
    authorize(transactionService),
    read,
);

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
 *               - isIncome
 *               - isRecurring
 *             properties:
 *               name:
 *                 type: string
 *               value:
 *                 type: number
 *               isIncome:
 *                 type: boolean
 *               isRecurring:
 *                 type: boolean
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
    authenticate(jwtService, userService),
    validateParams(authorizeParamsSchema),
    authorize(transactionService),
    validateBody(updateBodySchema),
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
router.delete(
    '/:id',
    authenticate(jwtService, userService),
    validateParams(authorizeParamsSchema),
    authorize(transactionService),
    remove,
);

export default router;
