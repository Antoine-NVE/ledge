import { Request, Response } from 'express';
import { TransactionOrchestrator } from '../../application/transaction/transaction-orchestrator';
import { CreateBody, UpdateBody } from './transaction-types';
import { ParamsDictionary } from 'express-serve-static-core';

export class TransactionController {
    constructor(private transactionOrchestrator: TransactionOrchestrator) {}

    create = async (
        req: Request<ParamsDictionary, unknown, CreateBody>,
        res: Response,
    ) => {
        const transaction = await this.transactionOrchestrator.create({
            ...req.body,
            userId: req.user._id,
        });

        res.status(201).json({
            message: 'Transaction created successfully',
            data: {
                transaction,
            },
        });
    };

    readAll = async (req: Request, res: Response) => {
        const transactions = await this.transactionOrchestrator.readAll(
            req.user._id,
        );

        res.status(200).json({
            message: 'Transactions retrieved successfully',
            data: {
                transactions,
            },
        });
    };

    read = async (req: Request, res: Response) => {
        res.status(200).json({
            message: 'Transaction retrieved successfully',
            data: {
                transaction: req.transaction,
            },
        });
    };

    update = async (
        req: Request<ParamsDictionary, unknown, UpdateBody>,
        res: Response,
    ) => {
        const transaction = await this.transactionOrchestrator.update(
            req.transaction,
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
        this.transactionOrchestrator.delete(req.transaction._id);

        res.status(200).json({
            message: 'Transaction deleted successfully',
        });
    };
}
