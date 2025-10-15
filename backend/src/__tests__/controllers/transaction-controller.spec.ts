import { TransactionController } from '../../controllers/TransactionController';
import { TransactionService } from '../../services/TransactionService';
import {
    UndefinedTransactionError,
    UndefinedUserError,
} from '../../errors/InternalServerError';
import { parseSchema } from '../../utils/schema';
import { Transaction } from '../../types/Transaction';
import { ObjectId } from 'mongodb';

jest.mock('../../utils/schema', () => ({
    parseSchema: jest.fn((_, value) => value),
}));

jest.mock('../../schemas/transaction', () => ({
    transactionCreateSchema: {},
    transactionUpdateSchema: {},
}));

describe('TransactionController', () => {
    let transactionService: jest.Mocked<TransactionService>;
    let controller: TransactionController;
    let mockReq: any;
    let mockRes: any;

    beforeEach(() => {
        transactionService = {
            insertOne: jest.fn(),
            findByUserId: jest.fn(),
            updateOne: jest.fn(),
            deleteOneById: jest.fn(),
        } as any;

        controller = new TransactionController(transactionService);

        mockReq = { body: {}, user: undefined, transaction: undefined };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe('create()', () => {
        it('should throw if user is undefined', async () => {
            mockReq.user = undefined;

            await expect(controller.create(mockReq, mockRes)).rejects.toThrow(
                UndefinedUserError,
            );
        });

        it('should create a transaction and return it', async () => {
            mockReq.user = { _id: 'user-id' };
            mockReq.body = {
                month: '2025-10',
                name: 'Salary',
                value: 3000,
                isIncome: true,
                isRecurring: false,
            };

            const mockTransaction = { id: 't1', ...mockReq.body };
            transactionService.insertOne.mockResolvedValue(mockTransaction);

            await controller.create(mockReq, mockRes);

            expect(transactionService.insertOne).toHaveBeenCalledWith(
                '2025-10',
                'Salary',
                3000,
                true,
                false,
                'user-id',
            );
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Transaction created successfully',
                data: { transaction: mockTransaction },
            });
        });
    });

    describe('readMany()', () => {
        it('should throw if user is undefined', async () => {
            mockReq.user = undefined;

            await expect(controller.readMany(mockReq, mockRes)).rejects.toThrow(
                UndefinedUserError,
            );
        });

        it('should return all transactions for the user', async () => {
            const transactions: Transaction[] = [
                {
                    _id: new ObjectId(),
                    name: 'Groceries',
                    value: 100,
                    isIncome: false,
                    isRecurring: false,
                    userId: new ObjectId(),
                    month: '2025-10',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    _id: new ObjectId(),
                    name: 'Freelance',
                    value: 500,
                    isIncome: true,
                    isRecurring: false,
                    userId: new ObjectId(),
                    month: '2025-10',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            mockReq.user = { _id: 'user-id' };
            transactionService.findByUserId.mockResolvedValue(transactions);

            await controller.readMany(mockReq, mockRes);

            expect(transactionService.findByUserId).toHaveBeenCalledWith(
                'user-id',
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Transactions retrieved successfully',
                data: { transactions },
            });
        });
    });

    describe('read()', () => {
        it('should throw if transaction is undefined', async () => {
            mockReq.transaction = undefined;

            await expect(controller.read(mockReq, mockRes)).rejects.toThrow(
                UndefinedTransactionError,
            );
        });

        it('should return the transaction', async () => {
            const transaction = { id: 't1', name: 'Groceries' };
            mockReq.transaction = transaction;

            await controller.read(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Transaction retrieved successfully',
                data: { transaction },
            });
        });
    });

    describe('update()', () => {
        it('should throw if transaction is undefined', async () => {
            mockReq.transaction = undefined;

            await expect(controller.update(mockReq, mockRes)).rejects.toThrow(
                UndefinedTransactionError,
            );
        });

        it('should update the transaction and return it', async () => {
            const transaction = {
                id: 't1',
                name: 'Old',
                value: 50,
                isIncome: false,
                isRecurring: false,
            };
            mockReq.transaction = { ...transaction };
            mockReq.body = {
                name: 'Updated',
                value: 100,
                isIncome: true,
                isRecurring: true,
            };

            const updated = { ...transaction, ...mockReq.body };
            transactionService.updateOne.mockResolvedValue(updated);

            await controller.update(mockReq, mockRes);

            expect(transactionService.updateOne).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'Updated',
                    value: 100,
                    isIncome: true,
                    isRecurring: true,
                }),
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Transaction updated successfully',
                data: { transaction: updated },
            });
        });
    });

    describe('delete()', () => {
        it('should throw if transaction is undefined', async () => {
            mockReq.transaction = undefined;

            await expect(controller.delete(mockReq, mockRes)).rejects.toThrow(
                UndefinedTransactionError,
            );
        });

        it('should delete the transaction and return success message', async () => {
            const transaction = { _id: 't1' };
            mockReq.transaction = transaction;

            await controller.delete(mockReq, mockRes);

            expect(transactionService.deleteOneById).toHaveBeenCalledWith('t1');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Transaction deleted successfully',
            });
        });
    });
});
