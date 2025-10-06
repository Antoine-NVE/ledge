import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { formatMongooseValidationErrors } from '../utils/error';
import { UndefinedTransactionError, UndefinedUserError } from '../errors/InternalServerError';
import { TransactionRepository } from '../repositories/TransactionRepository';
import {
    partialTransactionSchema,
    transactionCreateSchema,
    transactionSchema,
    transactionUpdateSchema,
} from '../schemas/transactionSchema';
import { Transaction } from '../types/transaction';
import { TransactionNotFoundError } from '../errors/NotFoundError';

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
        let transaction: Transaction | null | undefined = req.transaction;
        if (!transaction) throw new UndefinedTransactionError();

        const body = transactionUpdateSchema.parse(req.body);

        const transactionData = partialTransactionSchema.parse({
            ...body,
            updatedAt: new Date(),
        });
        transaction = await this.transactionRepository.findOneByIdAndUpdate(
            transaction._id,
            transactionData,
        );
        if (!transaction) throw new TransactionNotFoundError(); // Shouldn't happen

        res.status(200).json({
            message: 'Transaction updated successfully',
            data: {
                transaction,
            },
            errors: null,
        });
    };

    remove = async (req: Request, res: Response) => {
        const transaction = req.transaction;
        if (!transaction) throw new UndefinedTransactionError();

        this.transactionRepository.deleteOneById(transaction._id);

        res.status(200).json({
            message: 'Transaction deleted successfully',
            data: null,
            errors: null,
        });
    };
}
