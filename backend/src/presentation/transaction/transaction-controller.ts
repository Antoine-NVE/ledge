import { Request, Response } from 'express';
import { parseSchema } from '../../utils/schema-utils';
import {
    transactionCreateSchema,
    transactionUpdateSchema,
} from '../../schemas/transaction-schemas';
import { InternalServerError } from '../../errors/internal-server-error';
import { Transaction } from '../../domain/transaction/transaction-types';
import { TransactionOrchestrator } from '../../application/transaction/transaction-orchestrator';

export class TransactionController {
    constructor(private transactionOrchestrator: TransactionOrchestrator) {}

    create = async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) throw new InternalServerError('Undefined user');

        const data = parseSchema(transactionCreateSchema, req.body, true);

        const transaction = await this.transactionOrchestrator.create({
            ...data,
            userId: user._id,
        });

        res.status(201).json({
            message: 'Transaction created successfully',
            data: {
                transaction,
            },
        });
    };

    readAll = async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) throw new InternalServerError('Undefined user');

        const transactions = await this.transactionOrchestrator.readAll(
            user._id,
        );

        res.status(200).json({
            message: 'Transactions retrieved successfully',
            data: {
                transactions,
            },
        });
    };

    read = async (req: Request, res: Response) => {
        const transaction = req.transaction;
        if (!transaction)
            throw new InternalServerError('Undefined transaction');

        res.status(200).json({
            message: 'Transaction retrieved successfully',
            data: {
                transaction,
            },
        });
    };

    update = async (req: Request, res: Response) => {
        let transaction: Transaction | undefined = req.transaction;
        if (!transaction)
            throw new InternalServerError('Undefined transaction');

        const data = parseSchema(transactionUpdateSchema, req.body, true);

        transaction = await this.transactionOrchestrator.update(
            transaction,
            data,
        );

        res.status(200).json({
            message: 'Transaction updated successfully',
            data: {
                transaction,
            },
        });
    };

    delete = async (req: Request, res: Response) => {
        const transaction = req.transaction;
        if (!transaction)
            throw new InternalServerError('Undefined transaction');

        this.transactionOrchestrator.delete(transaction._id);

        res.status(200).json({
            message: 'Transaction deleted successfully',
        });
    };
}
