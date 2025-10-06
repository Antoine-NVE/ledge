import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { formatMongooseValidationErrors } from '../utils/error';
import { UndefinedTransactionError, UndefinedUserError } from '../errors/InternalServerError';
import { TransactionRepository } from '../repositories/TransactionRepository';
import {
    transactionCreateSchema,
    transactionSchema,
    transactionUpdateSchema,
} from '../schemas/transactionSchema';

export class TransactionController {
    constructor(private transactionRepository: TransactionRepository) {}

    create = async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        const body = transactionCreateSchema.parse(req.body);

        const transactionData = transactionSchema.parse({
            ...body,
            userId: user._id,
            createdAt: new Date(),
            updatedAt: null,
        });
        const transaction = await this.transactionRepository.insertOne(transactionData);

        res.status(201).json({
            message: 'Transaction created successfully',
            data: {
                transaction,
            },
            errors: null,
        });
    };

    findAll = async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        const transactions = await this.transactionRepository.findAllByUserId(user._id);

        res.status(200).json({
            message: 'Transactions retrieved successfully',
            data: {
                transactions,
            },
            errors: null,
        });
    };

    findOne = async (req: Request, res: Response) => {
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
        const body = transactionUpdateSchema.parse(req.body);

        const transaction = req.transaction;
        if (!transaction) throw new UndefinedTransactionError();

        const updatedTransaction = await this.transactionService.updateFromDocument(transaction, {
            ...body,
        });

        res.status(200).json({
            message: 'Transaction updated successfully',
            data: {
                transaction: updatedTransaction,
            },
            errors: null,
        });
    };

    remove = async (req: Request, res: Response) => {
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
    };
}
