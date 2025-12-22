import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { TransactionService } from '../../../domain/transaction/transaction-service';
import { Logger } from '../../../application/ports/logger';
import z from 'zod';
import { createBodySchema, updateBodySchema } from './transaction-schemas';

type CreateBody = z.infer<typeof createBodySchema>;

type UpdateBody = z.infer<typeof updateBodySchema>;

export class TransactionController {
    constructor(
        private transactionService: TransactionService,
        private logger: Logger,
    ) {}

    create = async (req: Request<ParamsDictionary, unknown, CreateBody>, res: Response) => {
        const transaction = await this.transactionService.create({
            ...req.body,
            userId: req.user.id,
        });

        const message = 'Transaction created successfully';
        this.logger.info(message, {
            userId: req.user.id,
            transactionId: transaction.id,
        });
        res.status(201).json({
            success: true,
            message,
            data: {
                transaction,
            },
        });
    };

    readAll = async (req: Request, res: Response) => {
        const transactions = await this.transactionService.findManyByUserId({
            userId: req.user.id,
        });

        res.status(200).json({
            success: true,
            message: 'Transactions retrieved successfully',
            data: {
                transactions,
            },
        });
    };

    read = (req: Request, res: Response) => {
        res.status(200).json({
            success: true,
            message: 'Transaction retrieved successfully',
            data: {
                transaction: req.transaction,
            },
        });
    };

    update = async (req: Request<ParamsDictionary, unknown, UpdateBody>, res: Response) => {
        const transaction = await this.transactionService.update({
            transaction: req.transaction,
            newName: req.body.name,
            newValue: req.body.value,
            newType: req.body.type,
            newExpenseCategory: req.body.expenseCategory,
        });

        const message = 'Transaction updated successfully';
        this.logger.info(message, {
            userId: req.user.id,
            transactionId: req.transaction.id,
        });
        res.status(200).json({
            success: true,
            message,
            data: {
                transaction,
            },
        });
    };

    delete = async (req: Request, res: Response) => {
        await this.transactionService.deleteById({ id: req.transaction.id });

        const message = 'Transaction deleted successfully';
        this.logger.info(message, {
            userId: req.user.id,
            transactionId: req.transaction.id,
        });
        res.status(200).json({
            success: true,
            message,
        });
    };
}
