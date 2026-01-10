import type { Request, Response } from 'express';
import type { CreateTransactionUseCase } from '../../../application/transaction/create-transaction-use-case.js';
import type { GetUserTransactionsUseCase } from '../../../application/transaction/get-user-transactions-use-case.js';
import type { GetTransactionUseCase } from '../../../application/transaction/get-transaction-use-case.js';
import type { UpdateTransactionUseCase } from '../../../application/transaction/update-transaction-use-case.js';
import type { DeleteTransactionUseCase } from '../../../application/transaction/delete-transaction-use-case.js';
import type { TokenManager } from '../../../application/ports/token-manager.js';
import type { IdManager } from '../../../application/ports/id-manager.js';
import type { ApiError, ApiSuccess } from '../../types/api.js';
import type { Transaction } from '../../../domain/transaction/transaction-types.js';
import { AuthenticatedController } from './authenticated-controller.js';
import { createSchema, deleteSchema, readSchema, updateSchema } from '../schemas/transaction-schemas.js';
import { AuthorizationError } from '../../../application/errors/authorization.error.js';
import { ResourceNotFoundError } from '../../../application/errors/resource-not-found.error.js';

export class TransactionController extends AuthenticatedController {
    constructor(
        tokenManager: TokenManager,
        private idManager: IdManager,
        private createTransactionUseCase: CreateTransactionUseCase,
        private getUserTransactionsUseCase: GetUserTransactionsUseCase,
        private getTransactionUseCase: GetTransactionUseCase,
        private updateTransactionUseCase: UpdateTransactionUseCase,
        private deleteTransactionUseCase: DeleteTransactionUseCase,
    ) {
        super(tokenManager);
    }

    create = async (req: Request, res: Response) => {
        const userId = this.getUserId(req);

        const { body } = this.validate(req, createSchema);

        const { transaction } = await this.createTransactionUseCase.execute({ userId, ...body });

        const response: ApiSuccess<{ transaction: Transaction }> = {
            success: true,
            code: 'CREATED',
            message: 'Transaction created successfully',
            data: {
                transaction,
            },
        };
        res.status(201).json(response);
    };

    readAll = async (req: Request, res: Response) => {
        const userId = this.getUserId(req);

        const { transactions } = await this.getUserTransactionsUseCase.execute({ userId });

        const response: ApiSuccess<{ transactions: Transaction[] }> = {
            success: true,
            code: 'OK',
            message: 'Transactions retrieved successfully',
            data: {
                transactions,
            },
        };
        res.status(200).json(response);
    };

    read = async (req: Request, res: Response) => {
        const userId = this.getUserId(req);

        const { params } = this.validate(req, readSchema(this.idManager));

        try {
            const { transaction } = await this.getTransactionUseCase.execute({ ...params, userId });

            const response: ApiSuccess<{ transaction: Transaction }> = {
                success: true,
                code: 'OK',
                message: 'Transaction retrieved successfully',
                data: {
                    transaction,
                },
            };
            res.status(200).json(response);
        } catch (err: unknown) {
            if (err instanceof AuthorizationError) {
                const response: ApiError = {
                    success: false,
                    code: 'FORBIDDEN',
                    message: 'Do not have permission to read this transaction',
                };
                res.status(403).json(response);
                return;
            }
            if (err instanceof ResourceNotFoundError) {
                const response: ApiError = {
                    success: false,
                    code: 'NOT_FOUND',
                    message: 'Transaction not found',
                };
                res.status(404).json(response);
                return;
            }
            throw err;
        }
    };

    update = async (req: Request, res: Response) => {
        const userId = this.getUserId(req);

        const { body, params } = this.validate(req, updateSchema(this.idManager));

        try {
            const { transaction } = await this.updateTransactionUseCase.execute({ ...params, userId, ...body });

            const response: ApiSuccess<{ transaction: Transaction }> = {
                success: true,
                code: 'OK',
                message: 'Transaction updated successfully',
                data: {
                    transaction,
                },
            };
            res.status(200).json(response);
        } catch (err: unknown) {
            if (err instanceof AuthorizationError) {
                const response: ApiError = {
                    success: false,
                    code: 'FORBIDDEN',
                    message: 'Do not have permission to update this transaction',
                };
                res.status(403).json(response);
                return;
            }
            if (err instanceof ResourceNotFoundError) {
                const response: ApiError = {
                    success: false,
                    code: 'NOT_FOUND',
                    message: 'Transaction not found',
                };
                res.status(404).json(response);
                return;
            }
            throw err;
        }
    };

    delete = async (req: Request, res: Response) => {
        const userId = this.getUserId(req);

        const { params } = this.validate(req, deleteSchema(this.idManager));

        try {
            const { transaction } = await this.deleteTransactionUseCase.execute({ ...params, userId });

            const response: ApiSuccess<{ transaction: Transaction }> = {
                success: true,
                code: 'OK',
                message: 'Transaction deleted successfully',
                data: {
                    transaction,
                },
            };
            res.status(200).json(response);
        } catch (err: unknown) {
            if (err instanceof AuthorizationError) {
                const response: ApiError = {
                    success: false,
                    code: 'FORBIDDEN',
                    message: 'Do not have permission to delete this transaction',
                };
                res.status(403).json(response);
                return;
            }
            if (err instanceof ResourceNotFoundError) {
                const response: ApiError = {
                    success: false,
                    code: 'NOT_FOUND',
                    message: 'Transaction not found',
                };
                res.status(404).json(response);
                return;
            }
            throw err;
        }
    };
}
