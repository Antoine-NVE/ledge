import type { Request, Response } from 'express';
import type { CreateTransactionUseCase } from '../../../application/transaction/create-transaction-use-case.js';
import type { GetUserTransactionsUseCase } from '../../../application/transaction/get-user-transactions-use-case.js';
import type { GetTransactionUseCase } from '../../../application/transaction/get-transaction-use-case.js';
import type { UpdateTransactionUseCase } from '../../../application/transaction/update-transaction-use-case.js';
import type { DeleteTransactionUseCase } from '../../../application/transaction/delete-transaction-use-case.js';
import type { TokenManager } from '../../../application/ports/token-manager.js';
import type { IdManager } from '../../../application/ports/id-manager.js';
import type { ApiSuccess } from '../../types/api.js';
import type { Transaction } from '../../../domain/transaction/transaction-types.js';
import { AuthenticatedController } from './authenticated-controller.js';
import { createSchema, deleteSchema, readSchema, updateSchema } from '../schemas/transaction-schemas.js';

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

        const result = await this.createTransactionUseCase.execute({ userId, ...body });
        if (!result.success) throw result.error;
        const { transaction } = result.data;

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

        const result = await this.getUserTransactionsUseCase.execute({ userId });
        if (!result.success) throw result.error;
        const { transactions } = result.data;

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

        const result = await this.getTransactionUseCase.execute({ ...params, userId });
        if (!result.success) throw result.error;
        const { transaction } = result.data;

        const response: ApiSuccess<{ transaction: Transaction }> = {
            success: true,
            code: 'OK',
            message: 'Transaction retrieved successfully',
            data: {
                transaction,
            },
        };
        res.status(200).json(response);
    };

    update = async (req: Request, res: Response) => {
        const userId = this.getUserId(req);

        const { body, params } = this.validate(req, updateSchema(this.idManager));

        const result = await this.updateTransactionUseCase.execute({ ...params, userId, ...body });
        if (!result.success) throw result.error;
        const { transaction } = result.data;

        const response: ApiSuccess<{ transaction: Transaction }> = {
            success: true,
            code: 'OK',
            message: 'Transaction updated successfully',
            data: {
                transaction,
            },
        };
        res.status(200).json(response);
    };

    delete = async (req: Request, res: Response) => {
        const userId = this.getUserId(req);

        const { params } = this.validate(req, deleteSchema(this.idManager));

        const result = await this.deleteTransactionUseCase.execute({ ...params, userId });
        if (!result.success) throw result.error;
        const { transaction } = result.data;

        const response: ApiSuccess<{ transaction: Transaction }> = {
            success: true,
            code: 'OK',
            message: 'Transaction deleted successfully',
            data: {
                transaction,
            },
        };
        res.status(200).json(response);
    };
}
