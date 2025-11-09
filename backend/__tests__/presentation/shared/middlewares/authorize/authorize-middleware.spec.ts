import { Request, Response, NextFunction } from 'express';
import { authorize } from '../../../../../src/presentation/shared/middlewares/authorize/authorize-middleware';
import { TransactionService } from '../../../../../src/domain/transaction/transaction-service';
import { ForbiddenError } from '../../../../../src/infrastructure/errors/forbidden-error';
import { Transaction } from '../../../../../src/domain/transaction/transaction-types';
import { ObjectId } from 'mongodb';
import { AuthorizeParams } from '../../../../../src/presentation/shared/middlewares/authorize/authorize-types';

describe('authorize middleware', () => {
    const USER_ID = new ObjectId();
    const PARAM_ID = new ObjectId().toString();
    const OTHER_USER_ID = new ObjectId();

    let transactionService: jest.Mocked<TransactionService>;
    let req: Request<AuthorizeParams>;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        transactionService = {
            read: jest.fn(),
        } as unknown as jest.Mocked<TransactionService>;
        req = {
            params: { id: PARAM_ID },
            user: { _id: USER_ID },
        } as Request<AuthorizeParams>;
        res = {} as Response;
        next = jest.fn();
    });

    it('calls next() if user owns the transaction', async () => {
        const transaction = { userId: USER_ID } as Transaction;
        transactionService.read.mockResolvedValue(transaction);

        await authorize(transactionService)(req, res, next);

        expect(transactionService.read).toHaveBeenCalledWith(
            new ObjectId(PARAM_ID),
        );
        expect(req.transaction).toBe(transaction);
        expect(next).toHaveBeenCalled();
    });

    it('throws ForbiddenError if transaction belongs to another user', async () => {
        transactionService.read.mockResolvedValue({
            userId: OTHER_USER_ID,
        } as Transaction);

        await expect(
            authorize(transactionService)(req, res, next),
        ).rejects.toThrow(ForbiddenError);
        expect(next).not.toHaveBeenCalled();
    });
});
