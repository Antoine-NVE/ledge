import { Request, Response } from 'express';
import { UndefinedTransactionError, UndefinedUserError } from '../errors/InternalServerError';
import { TransactionRepository } from '../repositories/TransactionRepository';
import {
    transactionCreateInputSchema,
    transactionSchema,
    transactionUpdateInputSchema,
} from '../schemas/transactionSchema';
import { Transaction } from '../types/transactionType';
import { TransactionNotFoundError } from '../errors/NotFoundError';

export class TransactionController {
    constructor(private transactionRepository: TransactionRepository) {}

    create = async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        const body = transactionCreateInputSchema.parse(req.body);

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

    readAll = async (req: Request, res: Response) => {
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
        let transaction: Transaction | null | undefined = req.transaction;
        if (!transaction) throw new UndefinedTransactionError();

        const body = transactionUpdateInputSchema.parse(req.body);

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

    delete = async (req: Request, res: Response) => {
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
