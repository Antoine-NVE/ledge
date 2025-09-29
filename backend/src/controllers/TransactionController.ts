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

export const create = async (req: Request<object, object, CreateTransactionBody>, res: Response) => {
    const user = req.user;
    if (!user) throw new UndefinedUserError();

    const transactionData = req.body;

    const transactionService = new TransactionService(new TransactionRepository(TransactionModel));
    const transaction = await transactionService.create({
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
};

export const findAll = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) throw new UndefinedUserError();

    const transactionService = new TransactionService(new TransactionRepository(TransactionModel));
    const transactions = await transactionService.findByUser(user);

    res.status(200).json({
        message: 'Transactions retrieved successfully',
        data: {
            transactions,
        },
        errors: null,
    });
};

export const findOne = async (req: Request, res: Response) => {
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

export const update = async (req: Request<object, object, UpdateTransactionBody>, res: Response) => {
    const transaction = req.transaction;
    if (!transaction) throw new UndefinedTransactionError();

    const transactionData = req.body;

    const transactionService = new TransactionService(new TransactionRepository(TransactionModel));
    const updatedTransaction = await transactionService.updateFromDocument(transaction, {
        ...transactionData,
    });

    res.status(200).json({
        message: 'Transaction updated successfully',
        data: {
            transaction: updatedTransaction,
        },
        errors: null,
    });
};

export const remove = async (req: Request, res: Response) => {
    const transaction = req.transaction;
    if (!transaction) throw new UndefinedTransactionError();

    const transactionService = new TransactionService(new TransactionRepository(TransactionModel));
    await transactionService.delete(transaction._id);

    res.status(200).json({
        message: 'Transaction deleted successfully',
        data: {
            transaction,
        },
        errors: null,
    });
};
