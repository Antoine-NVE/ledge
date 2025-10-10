import { Request, Response } from 'express';
import { UndefinedTransactionError, UndefinedUserError } from '../errors/InternalServerError';
import { TransactionRepository } from '../repositories/TransactionRepository';
import {
    createTransactionInputSchema,
    transactionSchema,
    updateTransactionInputSchema,
} from '../schemas/transactionSchema';
import { Transaction } from '../types/Transaction';
import { TransactionNotFoundError } from '../errors/NotFoundError';
import { TransactionService } from '../services/TransactionService';

export class TransactionController {
    constructor(private transactionService: TransactionService) {}

    create = async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        const { month, name, value, isIncome, isRecurring } = createTransactionInputSchema.parse(
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
            errors: null,
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
            errors: null,
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
            errors: null,
        });
    };

    update = async (req: Request, res: Response) => {
        let transaction: Transaction | undefined = req.transaction;
        if (!transaction) throw new UndefinedTransactionError();

        const { name, value, isIncome, isRecurring } = updateTransactionInputSchema.parse(req.body);
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
            errors: null,
        });
    };

    delete = async (req: Request, res: Response) => {
        const transaction = req.transaction;
        if (!transaction) throw new UndefinedTransactionError();

        this.transactionService.deleteOneById(transaction._id);

        res.status(200).json({
            message: 'Transaction deleted successfully',
            data: null,
            errors: null,
        });
    };
}
