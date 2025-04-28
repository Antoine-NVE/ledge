import { Request, Response } from 'express';
import TransactionModel from '../models/Transaction';
import { Error } from 'mongoose';

const create = async (req: Request, res: Response) => {
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
        if (error instanceof Error.ValidationError) {
            res.status(400).json({
                message: 'Validation error',
                data: null,
                errors: error.errors,
            });
        } else {
            res.status(500).json({
                message: 'Internal server error',
                data: null,
                errors: null,
            });
        }
    }
};

export default {
    create,
};
