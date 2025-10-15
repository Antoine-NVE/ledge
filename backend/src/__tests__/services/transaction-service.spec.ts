import { ObjectId } from 'mongodb';
import { TransactionRepository } from '../../repositories/TransactionRepository';
import { TransactionService } from '../../services/TransactionService';
import { Transaction } from '../../types/Transaction';
import { TransactionNotFoundError } from '../../errors/NotFoundError';

jest.mock('../../utils/schema', () => ({
    parseSchema: jest.fn((_schema, data) => data),
}));

describe('TransactionService', () => {
    let service: TransactionService;
    let mockRepository: jest.Mocked<TransactionRepository>;

    const fakeTransaction: Transaction = {
        _id: new ObjectId(),
        month: '2025-10',
        name: 'Salary',
        value: 2000,
        isIncome: true,
        isRecurring: false,
        userId: new ObjectId(),
        createdAt: new Date(),
        updatedAt: null,
    };

    beforeEach(() => {
        mockRepository = {
            insertOne: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
        } as unknown as jest.Mocked<TransactionRepository>;

        service = new TransactionService(mockRepository);
    });

    describe('insertOne()', () => {
        it('should create and insert a valid transaction', async () => {
            const result = await service.insertOne(
                '2025-10',
                'Salary',
                2000,
                true,
                false,
                fakeTransaction.userId,
            );

            expect(mockRepository.insertOne).toHaveBeenCalledTimes(1);
            expect(mockRepository.insertOne).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'Salary',
                    value: 2000,
                    isIncome: true,
                    isRecurring: false,
                }),
            );
            expect(result.name).toBe('Salary');
        });
    });

    describe('findByUserId()', () => {
        it('should return all transactions for a user', async () => {
            (mockRepository.find as jest.Mock).mockResolvedValue([
                fakeTransaction,
            ]);

            const result = await service.findByUserId(fakeTransaction.userId);

            expect(mockRepository.find).toHaveBeenCalledWith(
                'userId',
                fakeTransaction.userId,
            );
            expect(result).toEqual([fakeTransaction]);
        });
    });

    describe('findOneById()', () => {
        it('should return a transaction if found', async () => {
            (mockRepository.findOne as jest.Mock).mockResolvedValue(
                fakeTransaction,
            );

            const result = await service.findOneById(fakeTransaction._id);

            expect(mockRepository.findOne).toHaveBeenCalledWith(
                '_id',
                fakeTransaction._id,
            );
            expect(result).toBe(fakeTransaction);
        });

        it('should throw TransactionNotFoundError if no transaction is found', async () => {
            (mockRepository.findOne as jest.Mock).mockResolvedValue(null);

            await expect(
                service.findOneById(fakeTransaction._id),
            ).rejects.toThrow(TransactionNotFoundError);
        });
    });

    describe('updateOne()', () => {
        it('should update a transaction and return the updated one', async () => {
            const updated = { ...fakeTransaction, name: 'Updated Salary' };

            const result = await service.updateOne(updated);

            expect(mockRepository.updateOne).toHaveBeenCalledWith(
                expect.objectContaining({ name: 'Updated Salary' }),
            );
            expect(result.name).toBe('Updated Salary');
            expect(result.updatedAt).toBeInstanceOf(Date);
        });
    });

    describe('deleteOneById()', () => {
        it('should call repository.deleteOne with correct id', async () => {
            await service.deleteOneById(fakeTransaction._id);

            expect(mockRepository.deleteOne).toHaveBeenCalledWith(
                '_id',
                fakeTransaction._id,
            );
        });
    });
});
