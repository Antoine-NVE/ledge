import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import { TransactionService } from '../../../../../domain/transaction/transaction-service';
import { Transaction } from '../../../../../domain/transaction/transaction-types';
import { ForbiddenError } from '../../../../../core/errors/forbidden-error';

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

export const createAuthorize = ({
    transactionService,
}: {
    transactionService: TransactionService;
}) => {
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
