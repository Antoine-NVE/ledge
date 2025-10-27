import { NextFunction, Request, Response } from 'express';
import { TransactionService } from '../../../../domain/transaction/transaction-service';
import { ForbiddenError } from '../../../../infrastructure/errors/forbidden-error';
import { authorizeParamsSchema } from './authorize-schemas';
import { InternalServerError } from '../../../../infrastructure/errors/internal-server-error';
import { formatError } from '../../../../infrastructure/utils/schema-utils';
import { Transaction } from '../../../../domain/transaction/transaction-types';

declare module 'express-serve-static-core' {
    interface Request {
        transaction: Transaction;
    }
}

export const authorize =
    (transactionService: TransactionService) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const { success, data, error } = authorizeParamsSchema.safeParse(
            req.params,
        );

        if (!success) {
            throw new InternalServerError(
                'Validation error',
                formatError(error),
            );
        }

        const transaction = await transactionService.read(data.id);

        if (!req.user._id.equals(transaction.userId)) {
            throw new ForbiddenError('Forbidden access');
        }

        req.transaction = transaction;
        next();
    };
