import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import TransactionModel, { TransactionDocument } from '../models/Transaction';

// Extend Express Request interface to include userId
declare module 'express-serve-static-core' {
    interface Request {
        transaction?: TransactionDocument;
    }
}

const authorizeTransactionAccess = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user!;
    const transactionId = req.params.id;

    if (!Types.ObjectId.isValid(transactionId)) {
        res.status(400).json({
            message: 'Invalid transaction ID',
            data: null,
            errors: null,
        });
        return;
    }

    try {
        const transaction = await TransactionModel.findById(transactionId);

        if (!transaction) {
            res.status(404).json({
                message: 'Transaction not found',
                data: null,
                errors: null,
            });
            return;
        }

        if (transaction.user._id.toString() !== user._id.toString()) {
            res.status(403).json({
                message: 'Forbidden',
                data: null,
                errors: null,
            });
            return;
        }

        req.transaction = transaction;
        next();
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Internal server error',
            data: null,
            errors: null,
        });
    }
};

export default authorizeTransactionAccess;
