import { NextFunction, Request, Response } from 'express';
import { TransactionService } from '../../../../domain/transaction/transaction-service';
import { ForbiddenError } from '../../../../infrastructure/errors/forbidden-error';
import { Transaction } from '../../../../domain/transaction/transaction-types';
import { ObjectId } from 'mongodb';
import { AuthorizeParams } from './authorize-types';

declare module 'express-serve-static-core' {
    interface Request {
        transaction: Transaction;
    }
}

export const authorize =
    (transactionService: TransactionService) =>
    async (
        req: Request<AuthorizeParams>,
        res: Response,
        next: NextFunction,
    ) => {
        const transaction = await transactionService.read(
            new ObjectId(req.params.id),
        );

        if (!req.user._id.equals(transaction.userId)) {
            throw new ForbiddenError('Forbidden access');
        }

        req.transaction = transaction;
        next();
    };
