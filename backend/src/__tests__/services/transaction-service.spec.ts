import { ObjectId } from 'mongodb';
import { parseSchema } from '../../utils/schema-utils';
import { TransactionService } from '../../services/transaction-service';
import { TransactionRepository } from '../../entities/transaction/transaction-repository';
import { transactionSchema } from '../../schemas/transaction-schemas';
import { Transaction } from '../../entities/transaction/transaction-types';

const transactionId = new ObjectId();
const month = '2025-10';
const name = 'Name';
const value = 123.45;
const isIncome = true;
const isRecurring = true;
const userId = new ObjectId();
const transaction = {} as unknown as Transaction;
const transactions = [transaction];

jest.mock('../../utils/schema-utils', () => ({
    parseSchema: jest.fn(),
}));

const transactionRepository = {
    insertOne: jest.fn(),
    find: jest.fn().mockResolvedValue(transactions),
    findOne: jest.fn().mockResolvedValue(transaction),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
} as unknown as TransactionRepository;

describe('TransactionService', () => {
    let transactionService: TransactionService;

    beforeEach(() => {
        jest.clearAllMocks();

        (parseSchema as jest.Mock).mockReturnValue(transaction);

        transactionService = new TransactionService(transactionRepository);
    });

    describe('insertOne', () => {
        it('should call parseSchema', async () => {
            await transactionService.insertOne(
                month,
                name,
                value,
                isIncome,
                isRecurring,
                userId,
            );

            expect(parseSchema).toHaveBeenCalledWith(
                transactionSchema,
                expect.objectContaining({
                    month,
                    name,
                    value,
                    isIncome,
                    isRecurring,
                    userId,
                }),
            );
        });

        it('should call transactionRepository to insertOne', async () => {
            await transactionService.insertOne(
                month,
                name,
                value,
                isIncome,
                isRecurring,
                userId,
            );

            expect(transactionRepository.insertOne).toHaveBeenCalledWith(
                transaction,
            );
        });

        it('should return transaction', async () => {
            const result = await transactionService.insertOne(
                month,
                name,
                value,
                isIncome,
                isRecurring,
                userId,
            );

            expect(result).toEqual(transaction);
        });
    });

    describe('findByUserId', () => {
        it('should call transactionRepository to find', async () => {
            await transactionService.findByUserId(userId);

            expect(transactionRepository.find).toHaveBeenCalledWith(
                'userId',
                userId,
            );
        });

        it('should return transactions', async () => {
            const result = await transactionService.findByUserId(userId);

            expect(result).toEqual(transactions);
        });
    });

    describe('findOneById', () => {
        it('should call transactionRepository to findOne', async () => {
            await transactionService.findOneById(transactionId);

            expect(transactionRepository.findOne).toHaveBeenCalledWith(
                '_id',
                transactionId,
            );
        });

        it('should return transaction', async () => {
            const result = await transactionService.findOneById(transactionId);

            expect(result).toEqual(transaction);
        });
    });

    describe('updateOne', () => {
        it('should call parseSchema', async () => {
            await transactionService.updateOne(transaction);

            expect(parseSchema).toHaveBeenCalledWith(
                transactionSchema,
                transaction,
            );
        });

        it('should call transactionRepository to updateOne', async () => {
            await transactionService.updateOne(transaction);

            expect(transactionRepository.updateOne).toHaveBeenCalledWith(
                transaction,
            );
        });

        it('should return transaction', async () => {
            const result = await transactionService.updateOne(transaction);

            expect(result).toEqual(transaction);
        });
    });

    describe('deleteOneById', () => {
        it('should call transactionRepository to deleteOne', async () => {
            await transactionService.deleteOneById(transactionId);

            expect(transactionRepository.deleteOne).toHaveBeenCalledWith(
                '_id',
                transactionId,
            );
        });
    });
});
