import { Request, Response } from 'express';
import { UndefinedTransactionError, UndefinedUserError } from '../errors/InternalServerError';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { Transaction } from '../types/Transaction';
import { TransactionNotFoundError } from '../errors/NotFoundError';
import { TransactionService } from '../services/TransactionService';
import { TransactionSchema } from '../schemas/TransactionSchema';
import { ValidationError } from '../errors/BadRequestError';
import { FormatUtils } from '../utils/FormatUtils';

export class TransactionController {
    constructor(
        private transactionService: TransactionService,
        private transactionSchema: TransactionSchema,
    ) {}

    create = async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        const result = this.transactionSchema.create.safeParse(req.body);
        if (!result.success) throw new ValidationError(result.error);
        const { month, name, value, isIncome, isRecurring } = result.data;

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

        const result = this.transactionSchema.update.safeParse(req.body);
        if (!result.success) throw new ValidationError(result.error);
        const { name, value, isIncome, isRecurring } = result.data;

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
