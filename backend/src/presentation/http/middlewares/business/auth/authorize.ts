import type { NextFunction, Request, Response } from 'express';
import z from 'zod';
import { TransactionService } from '../../../../../domain/transaction/transaction-service';
import type { Transaction } from '../../../../../domain/transaction/transaction-types.js';
import { ForbiddenError } from '../../../../../core/errors/forbidden-error.js';

declare module 'express-serve-static-core' {
    interface Request {
        transaction: Transaction;
    }
}

export const authorizeParamsSchema = z.object({
    id: z.string().regex(/^[a-fA-F0-9]{24}$/),
});

export type AuthorizeParams = z.infer<typeof authorizeParamsSchema>;

export type Authorize = ReturnType<typeof createAuthorize>;

export const createAuthorize = ({ transactionService }: { transactionService: TransactionService }) => {
    return async (req: Request<AuthorizeParams>, res: Response, next: NextFunction) => {
        const transaction = await transactionService.findById({
            id: req.params.id,
        });

        if (req.user.id !== transaction.userId) {
            throw new ForbiddenError();
        }

        req.transaction = transaction;
        next();
    };
};
