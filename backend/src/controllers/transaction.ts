import { Request, RequestHandler, Response } from 'express';
import TransactionModel from '../models/Transaction';
import { Error as MongooseError } from 'mongoose';

interface TransactionBody {
    month: string;
    income: boolean;
    fixed: boolean;
    name: string;
    value: number;
}

const create = async (req: Request<{}, {}, TransactionBody>, res: Response) => {
    const { month, income, fixed, name, value } = req.body;

    try {
        const transaction = new TransactionModel({
            month,
            income,
            fixed,
            name,
            value,
        });

        await transaction.save();
        res.status(201).json({
            message: 'Transaction created successfully',
            data: {
                transaction,
            },
            errors: null,
        });
    } catch (error: unknown) {
        if (error instanceof MongooseError.ValidationError) {
            const errors: Record<string, string> = {};

            for (const [key, err] of Object.entries(error.errors)) {
                errors[key] = err.message;
            }

            res.status(400).json({
                message: 'Validation error',
                data: null,
                errors,
            });
        }

        res.status(500).json({
            message: 'Internal server error',
            data: null,
            errors: null,
        });
    }
};

const getAll = async (req: Request, res: Response) => {
    try {
        const transactions = await TransactionModel.find();

        res.status(200).json({
            message: 'Transactions retrieved successfully',
            data: {
                transactions,
            },
            errors: null,
        });
    } catch (error: unknown) {
        res.status(500).json({
            message: 'Internal server error',
            data: null,
            errors: null,
        });
    }
};

const getById = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    try {
        const transaction = await TransactionModel.findById(id);

        if (!transaction) {
            res.status(404).json({
                message: 'Transaction not found',
                data: null,
                errors: null,
            });
        }

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

export default {
    create,
    getAll,
    getById,
};
