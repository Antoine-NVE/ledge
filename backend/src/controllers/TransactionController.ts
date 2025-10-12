import { Request, Response } from 'express';
import { UndefinedTransactionError, UndefinedUserError } from '../errors/InternalServerError';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { Transaction } from '../types/Transaction';
import { TransactionNotFoundError } from '../errors/NotFoundError';
import { TransactionService } from '../services/TransactionService';
import { TransactionSchema } from '../schemas/TransactionSchema';
import { ValidationError } from '../errors/BadRequestError';
import { FormatUtils } from '../utils/FormatUtils';
import z from 'zod';

export class TransactionController {
    constructor(
        private transactionService: TransactionService,
        private transactionSchema: TransactionSchema,
    ) {}

    create = async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        const { month, name, value, isIncome, isRecurring } = this.transactionSchema.parseCreate(
            req.body,
        );

        const transaction = await this.transactionService.insertOne(
            month,
            name,
            value,
            isIncome,
            isRecurring,
            user._id,
        );

        res.status(201).json({
            message: 'Transaction created successfully',
            data: {
                transaction,
            },
        });
    };

    readMany = async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        const transactions = await this.transactionService.findByUserId(user._id);

        res.status(200).json({
            message: 'Transactions retrieved successfully',
            data: {
                transactions,
            },
        });
    };

    read = async (req: Request, res: Response) => {
        const transaction = req.transaction;
        if (!transaction) throw new UndefinedTransactionError();

        res.status(200).json({
            message: 'Transaction retrieved successfully',
            data: {
                transaction,
            },
        });
    };

    update = async (req: Request, res: Response) => {
        let transaction: Transaction | undefined = req.transaction;
        if (!transaction) throw new UndefinedTransactionError();

        const { name, value, isIncome, isRecurring } = this.transactionSchema.parseUpdate(req.body);

        transaction.name = name;
        transaction.value = value;
        transaction.isIncome = isIncome;
        transaction.isRecurring = isRecurring;

        transaction = await this.transactionService.updateOne(transaction);

        res.status(200).json({
            message: 'Transaction updated successfully',
            data: {
                transaction,
            },
        });
    };

    delete = async (req: Request, res: Response) => {
        const transaction = req.transaction;
        if (!transaction) throw new UndefinedTransactionError();

        this.transactionService.deleteOneById(transaction._id);

        res.status(200).json({
            message: 'Transaction deleted successfully',
        });
    };
}
