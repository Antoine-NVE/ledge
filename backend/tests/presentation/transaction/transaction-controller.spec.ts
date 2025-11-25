import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { Transaction } from '../../../src/domain/transaction/transaction-types';
import { TransactionOrchestrator } from '../../../src/application/transaction/transaction-orchestrator';
import { TransactionController } from '../../../src/presentation/transaction/transaction-controller';
import { User } from '../../../src/domain/user/user-types';
import { Logger } from 'pino';

describe('TransactionController', () => {
    const USER_ID = new ObjectId();
    const TRANSACTION_ID = new ObjectId();
    const NAME = 'Example';
    const UPDATED_NAME = 'Updated example';

    let userMock: Partial<User>;
    let transactionMock: Partial<Transaction>;
    let updatedTransactionMock: Partial<Transaction>;
    let transactionArrayMock: Partial<Transaction>[];
    let reqMock: Partial<Request>;
    let resMock: Partial<Response>;
    let transactionOrchestratorMock: Partial<TransactionOrchestrator>;
    let loggerMock: Partial<Logger>;

    let transactionController: TransactionController;

    beforeEach(() => {
        userMock = {
            _id: USER_ID,
        };
        transactionMock = {
            _id: TRANSACTION_ID,
            name: NAME,
        };
        updatedTransactionMock = {
            _id: TRANSACTION_ID,
            name: UPDATED_NAME,
        };
        transactionArrayMock = [transactionMock];
        reqMock = {};
        reqMock.user = userMock as User;
        resMock = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        transactionOrchestratorMock = {
            create: jest.fn().mockResolvedValue(transactionMock),
            readAll: jest.fn().mockResolvedValue(transactionArrayMock),
            update: jest.fn().mockResolvedValue(updatedTransactionMock),
            delete: jest.fn(),
        };
        loggerMock = {
            info: jest.fn(),
        };

        transactionController = new TransactionController(
            transactionOrchestratorMock as TransactionOrchestrator,
            loggerMock as Logger,
        );
    });

    describe('create', () => {
        beforeEach(() => {
            reqMock.body = {
                name: NAME,
            };
        });

        it('should call transactionOrchestrator.create with valid parameters', async () => {
            await transactionController.create(
                reqMock as Request,
                resMock as Response,
            );

            expect(transactionOrchestratorMock.create).toHaveBeenCalledWith({
                name: NAME,
                userId: USER_ID,
            });
        });

        it('should call res.status().json() with valid parameters', async () => {
            await transactionController.create(
                reqMock as Request,
                resMock as Response,
            );

            expect(resMock.status).toHaveBeenCalledWith(201);
            expect(resMock.json).toHaveBeenCalledWith({
                message: 'Transaction created successfully',
                data: {
                    transaction: transactionMock,
                },
            });
        });
    });

    describe('readAll', () => {
        it('should call transactionOrchestrator.readAll with valid parameters', async () => {
            await transactionController.readAll(
                reqMock as Request,
                resMock as Response,
            );

            expect(transactionOrchestratorMock.readAll).toHaveBeenCalledWith(
                USER_ID,
            );
        });

        it('should call res.status().json() with valid parameters', async () => {
            await transactionController.readAll(
                reqMock as Request,
                resMock as Response,
            );

            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
                message: 'Transactions retrieved successfully',
                data: {
                    transactions: transactionArrayMock,
                },
            });
        });
    });

    describe('read', () => {
        beforeEach(() => {
            reqMock.transaction = transactionMock as Transaction;
        });

        it('should call res.status().json() with valid parameters', () => {
            transactionController.read(reqMock as Request, resMock as Response);

            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
                message: 'Transaction retrieved successfully',
                data: {
                    transaction: transactionMock,
                },
            });
        });
    });

    describe('update', () => {
        beforeEach(() => {
            reqMock.transaction = transactionMock as Transaction;
            reqMock.body = {
                name: UPDATED_NAME,
            };
        });

        it('should call transactionOrchestrator.update with valid parameters', async () => {
            await transactionController.update(
                reqMock as Request,
                resMock as Response,
            );

            expect(transactionOrchestratorMock.update).toHaveBeenCalledWith(
                transactionMock,
                {
                    name: UPDATED_NAME,
                },
            );
        });

        it('should call res.status().json() with valid parameters', async () => {
            await transactionController.update(
                reqMock as Request,
                resMock as Response,
            );

            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
                message: 'Transaction updated successfully',
                data: {
                    transaction: updatedTransactionMock,
                },
            });
        });
    });

    describe('delete', () => {
        beforeEach(() => {
            reqMock.transaction = transactionMock as Transaction;
        });

        it('should call transactionOrchestrator.delete with valid parameters', async () => {
            await transactionController.delete(
                reqMock as Request,
                resMock as Response,
            );

            expect(transactionOrchestratorMock.delete).toHaveBeenCalledWith(
                transactionMock,
            );
        });

        it('should call res.status().json() with valid parameters', async () => {
            await transactionController.delete(
                reqMock as Request,
                resMock as Response,
            );

            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
                message: 'Transaction deleted successfully',
            });
        });
    });
});
