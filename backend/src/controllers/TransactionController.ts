import { Request, Response } from 'express';
import { UndefinedTransactionError, UndefinedUserError } from '../errors/InternalServerError';
import { Transaction } from '../types/Transaction';
import { TransactionService } from '../services/TransactionService';
import { parseSchema } from '../utils/schema';
import { transactionCreateSchema, transactionUpdateSchema } from '../schemas/transaction';

export class TransactionController {
    constructor(private transactionService: TransactionService) {}

    create = async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) throw new UndefinedUserError();

        const { month, name, value, isIncome, isRecurring } = parseSchema(
            transactionCreateSchema,
            req.body,
            true,
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

        const { name, value, isIncome, isRecurring } = parseSchema(
            transactionUpdateSchema,
            req.body,
            true,
        );

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
