import { Request, Response } from 'express';
import TransactionModel from '../models/Transaction';
import { Error as MongooseError } from 'mongoose';
import { formatMongooseValidationErrors } from '../utils/errors';

interface TransactionBody {
    month: string;
    isIncome: boolean;
    isFixed: boolean;
    name: string;
    value: number;
}

export const createTransaction = async (req: Request<object, object, TransactionBody>, res: Response) => {
    const { month, isIncome, isFixed, name, value } = req.body;
    const user = req.user;

    try {
        const transaction = new TransactionModel({
            month,
            isIncome,
            isFixed,
            name,
            value,
            user,
        });

        // Save the transaction and populate the user field
        await (await transaction.save()).populate('user');

        res.status(201).json({
            message: 'Transaction created successfully',
            data: {
                transaction,
            },
            errors: null,
        });
    } catch (error: unknown) {
        if (error instanceof MongooseError.ValidationError) {
            res.status(400).json({
                message: 'Validation error',
                data: null,
                errors: formatMongooseValidationErrors(error),
            });
            return;
        }

        res.status(500).json({
            message: 'Internal server error',
            data: null,
            errors: null,
        });
    }
};

export const getTransactions = async (req: Request, res: Response) => {
    const user = req.user;

    try {
        const transactions = await TransactionModel.find({ user }).populate('user');

        res.status(200).json({
            message: 'Transactions retrieved successfully',
            data: {
                transactions,
            },
            errors: null,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Internal server error',
            data: null,
            errors: null,
        });
    }
};

export const getTransaction = async (req: Request, res: Response) => {
    const transaction = req.transaction;

    try {
        res.status(200).json({
            message: 'Transaction retrieved successfully',
            data: {
                transaction,
            },
            errors: null,
        });
    } catch (error: unknown) {
        if (error instanceof MongooseError.CastError) {
            res.status(400).json({
                message: 'Invalid transaction ID',
                data: null,
                errors: null,
            });
        }

        res.status(500).json({
            message: 'Internal server error',
            data: null,
            errors: null,
        });
    }
};

export const updateTransaction = async (req: Request<object, object, TransactionBody>, res: Response) => {
    const transaction = req.transaction!;
    const { month, isIncome, isFixed, name, value } = req.body;

    try {
        if (month !== undefined) transaction.month = month;
        if (isIncome !== undefined) transaction.isIncome = isIncome;
        if (isFixed !== undefined) transaction.isFixed = isFixed;
        if (name !== undefined) transaction.name = name;
        if (value !== undefined) transaction.value = value;

        await transaction.save();

        res.status(200).json({
            message: 'Transaction updated successfully',
            data: {
                transaction,
            },
            errors: null,
        });
    } catch (error: unknown) {
        if (error instanceof MongooseError.ValidationError) {
            res.status(400).json({
                message: 'Validation error',
                data: null,
                errors: formatMongooseValidationErrors(error),
            });
        }

        if (error instanceof MongooseError.CastError) {
            res.status(400).json({
                message: 'Invalid transaction ID',
                data: null,
                errors: null,
            });
        }

        res.status(500).json({
            message: 'Internal server error',
            data: null,
            errors: null,
        });
    }
};

export const removeTransaction = async (req: Request, res: Response) => {
    const transaction = req.transaction!;

    try {
        await transaction.deleteOne();

        res.status(200).json({
            message: 'Transaction deleted successfully',
            data: {
                transaction,
            },
            errors: null,
        });
    } catch (error: unknown) {
        if (error instanceof MongooseError.CastError) {
            res.status(400).json({
                message: 'Invalid transaction ID',
                data: null,
                errors: null,
            });
        }

        res.status(500).json({
            message: 'Internal server error',
            data: null,
            errors: null,
        });
    }
};
