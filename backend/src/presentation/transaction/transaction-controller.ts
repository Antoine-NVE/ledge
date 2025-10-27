import { Request, Response } from 'express';
import { InternalServerError } from '../../infrastructure/errors/internal-server-error';
import { Transaction } from '../../domain/transaction/transaction-types';
import { TransactionOrchestrator } from '../../application/transaction/transaction-orchestrator';

export class TransactionController {
    constructor(private transactionOrchestrator: TransactionOrchestrator) {}

    create = async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) throw new InternalServerError('Undefined user');

        const transaction = await this.transactionOrchestrator.create({
            ...req.body,
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

        transaction = await this.transactionOrchestrator.update(
            transaction,
            req.body,
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
