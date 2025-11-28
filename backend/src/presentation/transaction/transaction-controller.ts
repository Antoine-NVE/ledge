import { Request, Response } from 'express';
import { TransactionOrchestrator } from '../../application/transaction/transaction-orchestrator';
import { CreateBody, UpdateBody } from './transaction-types';
import { ParamsDictionary } from 'express-serve-static-core';
import { Logger } from '../../application/ports/logger';

export class TransactionController {
    constructor(
        private transactionOrchestrator: TransactionOrchestrator,
        private logger: Logger,
    ) {}

    create = async (
        req: Request<ParamsDictionary, unknown, CreateBody>,
        res: Response,
    ) => {
        const transaction = await this.transactionOrchestrator.create({
            ...req.body,
            userId: req.user._id,
        });

        const message = 'Transaction created successfully';
        this.logger.info(message, {
            userId: req.user._id,
            transactionId: transaction._id,
        });
        res.status(201).json({
            message,
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

    read = (req: Request, res: Response) => {
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

        const message = 'Transaction updated successfully';
        this.logger.info(message, {
            userId: req.user._id,
            transactionId: req.transaction._id,
        });
        res.status(200).json({
            message,
            data: {
                transaction,
            },
        });
    };

    delete = async (req: Request, res: Response) => {
        await this.transactionOrchestrator.delete(req.transaction);

        const message = 'Transaction deleted successfully';
        this.logger.info(message, {
            userId: req.user._id,
            transactionId: req.transaction._id,
        });
        res.status(200).json({
            message,
        });
    };
}
