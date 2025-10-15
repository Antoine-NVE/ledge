import { Collection, ObjectId } from 'mongodb';
import { Transaction } from '../../types/Transaction';
import { TransactionRepository } from '../../repositories/TransactionRepository';

describe('TransactionRepository', () => {
    let mockCollection: Partial<Collection<Transaction>>;
    let transactionRepository: TransactionRepository;

    const fakeTransaction: Transaction = {
        _id: new ObjectId(),
        month: '2025-04',
        name: 'Test transaction',
        value: 150,
        isIncome: true,
        isRecurring: false,
        userId: new ObjectId(),
        createdAt: new Date(),
        updatedAt: null,
    };

    beforeEach(() => {
        mockCollection = {
            insertOne: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
        };
        transactionRepository = new TransactionRepository(
            mockCollection as Collection<Transaction>,
        );
    });

    describe('insertOne()', () => {
        it('should call collection.insertOne with the provided transaction', async () => {
            await transactionRepository.insertOne(fakeTransaction);

            expect(mockCollection.insertOne).toHaveBeenCalledTimes(1);
            expect(mockCollection.insertOne).toHaveBeenCalledWith(
                fakeTransaction,
            );
        });
    });

    describe('find()', () => {
        it('should call collection.find with the correct filter and return an array', async () => {
            const mockCursor = {
                toArray: jest.fn().mockResolvedValue([fakeTransaction]),
            };
            (mockCollection.find as jest.Mock).mockReturnValue(mockCursor);

            const result = await transactionRepository.find(
                'userId',
                fakeTransaction.userId,
            );

            expect(mockCollection.find).toHaveBeenCalledWith({
                userId: fakeTransaction.userId,
            });
            expect(mockCursor.toArray).toHaveBeenCalled();
            expect(result).toEqual([fakeTransaction]);
        });
    });

    describe('findOne()', () => {
        it('should call collection.findOne with the correct filter and return the transaction', async () => {
            (mockCollection.findOne as jest.Mock).mockResolvedValue(
                fakeTransaction,
            );

            const result = await transactionRepository.findOne(
                '_id',
                fakeTransaction._id,
            );

            expect(mockCollection.findOne).toHaveBeenCalledWith({
                _id: fakeTransaction._id,
            });
            expect(result).toBe(fakeTransaction);
        });

        it('should return null when no transaction is found', async () => {
            (mockCollection.findOne as jest.Mock).mockResolvedValue(null);

            const result = await transactionRepository.findOne(
                'name',
                'Unknown',
            );
            expect(result).toBeNull();
        });
    });

    describe('updateOne()', () => {
        it('should call collection.updateOne with the correct filter and update object', async () => {
            await transactionRepository.updateOne(fakeTransaction);

            const { _id, ...rest } = fakeTransaction;
            expect(mockCollection.updateOne).toHaveBeenCalledWith(
                { _id },
                { $set: rest },
            );
        });
    });

    describe('deleteOne()', () => {
        it('should call collection.deleteOne with the correct filter', async () => {
            await transactionRepository.deleteOne('_id', fakeTransaction._id);

            expect(mockCollection.deleteOne).toHaveBeenCalledWith({
                _id: fakeTransaction._id,
            });
        });
    });
});
