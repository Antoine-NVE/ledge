import { Request, Response } from 'express';
import { Logger } from 'pino';
import { User } from '../../../../src/domain/user/user-types';
import { Transaction } from '../../../../src/domain/transaction/transaction-types';
import { TransactionController } from '../../../../src/presentation/http/transaction/transaction-controller';
import { TransactionService } from '../../../../src/domain/transaction/transaction-service';

declare module 'express-serve-static-core' {
    interface Request {
        transaction: Transaction;
        user: User;
    }
}

describe('TransactionController', () => {
    const USER_ID = 'USERID123';
    const TRANSACTION_ID = 'TRANSACTIONID123';
    const NAME = 'Example';
    const UPDATED_NAME = 'Updated example';

    let user: Partial<User>;
    let transaction: Partial<Transaction>;
    let updatedTransaction: Partial<Transaction>;
    let transactionArray: Partial<Transaction>[];

    let reqMock: Partial<Request>;
    let resMock: Partial<Response>;

    let transactionServiceMock: Partial<TransactionService>;
    let loggerMock: Partial<Logger>;

    let transactionController: TransactionController;

    beforeEach(() => {
        user = {
            id: USER_ID,
        };
        transaction = {
            id: TRANSACTION_ID,
            name: NAME,
        };
        updatedTransaction = {
            id: TRANSACTION_ID,
            name: UPDATED_NAME,
        };
        transactionArray = [transaction];

        reqMock = {};
        reqMock.user = user as User;
        resMock = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        transactionServiceMock = {
            create: jest.fn().mockResolvedValue(transaction),
            findManyByUserId: jest.fn().mockResolvedValue(transactionArray),
            update: jest.fn().mockResolvedValue(updatedTransaction),
            deleteById: jest.fn(),
        };
        loggerMock = {
            info: jest.fn(),
        };

        transactionController = new TransactionController(
            transactionServiceMock as TransactionService,
            loggerMock as Logger,
        );
    });

    describe('create', () => {
        beforeEach(() => {
            reqMock.body = {
                name: NAME,
            };
        });

        it('should call this.transactionService.create', async () => {
            await transactionController.create(reqMock as Request, resMock as Response);

            expect(transactionServiceMock.create).toHaveBeenCalledWith({
                userId: USER_ID,
                name: NAME,
            });
        });

        it('should call res.status and res.json', async () => {
            await transactionController.create(reqMock as Request, resMock as Response);

            expect(resMock.status).toHaveBeenCalledWith(201);
            expect(resMock.json).toHaveBeenCalledWith({
                success: true,
                message: 'Transaction created successfully',
                data: {
                    transaction: {
                        id: TRANSACTION_ID,
                        name: NAME,
                    },
                },
            });
        });
    });

    describe('readAll', () => {
        it('should call this.transactionService.findManyByUserId', async () => {
            await transactionController.readAll(reqMock as Request, resMock as Response);

            expect(transactionServiceMock.findManyByUserId).toHaveBeenCalledWith({ userId: USER_ID });
        });

        it('should call res.status and res.json', async () => {
            await transactionController.readAll(reqMock as Request, resMock as Response);

            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
                success: true,
                message: 'Transactions retrieved successfully',
                data: {
                    transactions: [{ id: TRANSACTION_ID, name: NAME }],
                },
            });
        });
    });

    describe('read', () => {
        beforeEach(() => {
            reqMock.transaction = transaction as Transaction;
        });

        it('should call res.status and res.json', () => {
            transactionController.read(reqMock as Request, resMock as Response);

            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
                success: true,
                message: 'Transaction retrieved successfully',
                data: {
                    transaction: {
                        id: TRANSACTION_ID,
                        name: NAME,
                    },
                },
            });
        });
    });

    describe('update', () => {
        beforeEach(() => {
            reqMock.transaction = transaction as Transaction;
            reqMock.body = {
                name: UPDATED_NAME,
            };
        });

        it('should call this.transactionService.update', async () => {
            await transactionController.update(reqMock as Request, resMock as Response);

            expect(transactionServiceMock.update).toHaveBeenCalledWith({
                transaction,
                newName: UPDATED_NAME,
                newValue: undefined,
                newType: undefined,
                newExpenseCategory: undefined,
            });
        });

        it('should call res.status and res.json', async () => {
            await transactionController.update(reqMock as Request, resMock as Response);

            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
                success: true,
                message: 'Transaction updated successfully',
                data: {
                    transaction: {
                        id: TRANSACTION_ID,
                        name: UPDATED_NAME,
                    },
                },
            });
        });
    });

    describe('delete', () => {
        beforeEach(() => {
            reqMock.transaction = transaction as Transaction;
        });

        it('should call this.transactionService.deleteById', async () => {
            await transactionController.delete(reqMock as Request, resMock as Response);

            expect(transactionServiceMock.deleteById).toHaveBeenCalledWith({
                id: TRANSACTION_ID,
            });
        });

        it('should call res.status and res.json', async () => {
            await transactionController.delete(reqMock as Request, resMock as Response);

            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
                success: true,
                message: 'Transaction deleted successfully',
            });
        });
    });
});
