import { NextFunction, Request, Response } from 'express';
import { TransactionService } from '../../../../domain/transaction/transaction-service';
import { ForbiddenError } from '../../../../infrastructure/errors/forbidden-error';
import { Transaction } from '../../../../domain/transaction/transaction-types';
import z from 'zod';

declare module 'express-serve-static-core' {
    interface Request {
        transaction: Transaction;
    }
}

export const authorizeParamsSchema = z.object({
    id: z.string(),
});

export type AuthorizeParams = z.infer<typeof authorizeParamsSchema>;

export type Authorize = ReturnType<typeof createAuthorize>;

export const createAuthorize = (transactionService: TransactionService) => {
    return async (
        req: Request<AuthorizeParams>,
        res: Response,
        next: NextFunction,
    ) => {
        const transaction = await transactionService.findById({
            id: req.params.id,
        });

        if (req.user.id !== transaction.userId) {
            throw new ForbiddenError('Forbidden access');
        }

        req.transaction = transaction;
        next();
    };
};
