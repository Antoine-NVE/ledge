import { Request, Response } from 'express';
import TransactionModel from '../models/Transaction';
import { Error as MongooseError } from 'mongoose';
import { formatMongooseValidationErrors } from '../utils/error';
import { UndefinedTransactionError, UndefinedUserError } from '../errors/InternalServerError';
import { TransactionService } from '../services/TransactionService';
import { TransactionRepository } from '../repositories/TransactionRepository';

interface CreateTransactionBody {
    month: string;
    isIncome: boolean;
    isRecurring: boolean;
    name: string;
    value: number;
}

interface UpdateTransactionBody {
    month: string | undefined;
    isIncome: boolean | undefined;
    isRecurring: boolean | undefined;
    name: string | undefined;
    value: number | undefined;
}

export class TransactionController {
    constructor(private transactionService: TransactionService) {}

    async create(req: Request<object, object, CreateTransactionBody>, res: Response) {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        const transactionData = req.body;

        const transaction = await this.transactionService.create({
            ...transactionData,
            user: user._id,
        });

        res.status(201).json({
            message: 'Transaction created successfully',
            data: {
                transaction,
            },
            errors: null,
        });
    }

    async findAll(req: Request, res: Response) {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        const transactions = await this.transactionService.findByUser(user);

        res.status(200).json({
            message: 'Transactions retrieved successfully',
            data: {
                transactions,
            },
            errors: null,
        });
    }

    async findOne(req: Request, res: Response) {
        const transaction = req.transaction;
        if (!transaction) throw new UndefinedTransactionError();

        res.status(200).json({
            message: 'Transaction retrieved successfully',
            data: {
                transaction,
            },
            errors: null,
        });
    }

    async update(req: Request<object, object, UpdateTransactionBody>, res: Response) {
        const transaction = req.transaction;
        if (!transaction) throw new UndefinedTransactionError();

        const transactionData = req.body;

        const updatedTransaction = await this.transactionService.updateFromDocument(transaction, {
            ...transactionData,
        });

        res.status(200).json({
            message: 'Transaction updated successfully',
            data: {
                transaction: updatedTransaction,
            },
            errors: null,
        });
    }

    async remove(req: Request, res: Response) {
        const transaction = req.transaction;
        if (!transaction) throw new UndefinedTransactionError();

        await this.transactionService.delete(transaction._id);

        res.status(200).json({
            message: 'Transaction deleted successfully',
            data: {
                transaction,
            },
            errors: null,
        });
    }
}
